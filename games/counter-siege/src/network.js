import * as THREE from 'three';
import { buildThirdPersonRifle } from './weapons.js';
import { bridge } from './bridge.js';

/**
 * Remote Opponent Mannequin for external room sessions
 * Replicates remote peer position, rotation, leaning, and firing visuals.
 */
export class RemotePlayer {
  constructor(scene, isHost = false) {
    this.scene = scene;
    this.isHost = isHost;

    this.health = 100;
    this.armor = 100;
    this.isDead = false;

    this.position = new THREE.Vector3();
    this.targetPos = new THREE.Vector3();
    this.yaw = 0;
    this.targetYaw = 0;
    this.pitch = 0;
    this.lean = 0;
    this.isCrouching = false;

    // Segmented Hitboxes for raycasts
    this.hitMeshes = [];
    this.headMesh = null;
    this.root = this.buildMannequin();
    this.scene.add(this.root);

    // Muzzle flash
    this.muzzleFlash = this.createMuzzleFlash();
    this.root.add(this.muzzleFlash);
    this.flashTimer = 0;
  }

  buildMannequin() {
    const root = new THREE.Group();

    // Player team color: Host = Navy (`#204075`), Client = Crimson (`#b52424`)
    const suitColor = this.isHost ? 0xb52424 : 0x244275;
    const plateColor = this.isHost ? 0x821818 : 0x192b4d;

    const suitMat = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.5, metalness: 0.25 });
    const plateMat = new THREE.MeshStandardMaterial({ color: plateColor, roughness: 0.4, metalness: 0.5 });
    const darkUnderMat = new THREE.MeshStandardMaterial({ color: 0x1f1b1a, roughness: 0.7, metalness: 0.1 });
    const visorMat = new THREE.MeshStandardMaterial({ color: 0xd8b172, metalness: 0.9, roughness: 0.15 });
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x151618, metalness: 0.8, roughness: 0.4 });

    // Bean Body (Capsule: radius 0.32, height 0.65)
    const beanGeo = new THREE.CapsuleGeometry(0.32, 0.65, 8, 16);
    const beanMesh = new THREE.Mesh(beanGeo, suitMat);
    beanMesh.position.y = 0.65;
    beanMesh.castShadow = true;
    beanMesh.receiveShadow = true;
    root.add(beanMesh);
    this.hitMeshes.push(beanMesh);

    // Spherical Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.34, 0);

    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, suitMat);
    headMesh.userData.isHead = true;
    headMesh.castShadow = true;
    headGroup.add(headMesh);
    this.hitMeshes.push(headMesh);

    // Visor on head
    const visorGeo = new THREE.BoxGeometry(0.22, 0.08, 0.12);
    const visorMesh = new THREE.Mesh(visorGeo, darkUnderMat);
    visorMesh.position.set(0, 0.02, 0.16);
    visorMesh.userData.isHead = true;
    headGroup.add(visorMesh);
    this.hitMeshes.push(visorMesh);

    root.add(headGroup);
    this.headMesh = headGroup;

    // Weapon mesh
    const gun = buildThirdPersonRifle();
    gun.position.set(0.28, 0.78, 0.28);
    gun.rotation.x = -0.1;
    root.add(gun);

    return root;
  }

  createMuzzleFlash() {
    const flashGroup = new THREE.Group();
    flashGroup.visible = false;
    flashGroup.position.set(0.22, 1.05, 0.8);
    const geo = new THREE.OctahedronGeometry(0.07, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    flashGroup.add(new THREE.Mesh(geo, mat));
    return flashGroup;
  }

  getHitMeshes() {
    return this.hitMeshes;
  }

  playFireEffect() {
    this.muzzleFlash.visible = true;
    this.flashTimer = 0.05;
  }

  update(dt) {
    // Smooth interpolation to avoid network jitter
    this.position.lerp(this.targetPos, 14 * dt);
    this.yaw = THREE.MathUtils.lerp(this.yaw, this.targetYaw, 14 * dt);

    this.root.position.copy(this.position);
    this.root.rotation.y = this.yaw;

    // Lean roll and offset
    if (this.headMesh) {
      this.headMesh.position.x = this.lean * 0.35;
      this.headMesh.rotation.z = -this.lean * 0.2;
    }

    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) this.muzzleFlash.visible = false;
    }
  }

  takeDamage(amount, attackerPos, isHeadshot) {
    if (this.isDead) return;

    if (this.armor > 0) {
      if (this.armor >= amount) {
        this.armor -= amount;
        amount = 0;
      } else {
        amount -= this.armor;
        this.armor = 0;
      }
    }

    if (amount > 0) {
      this.health = Math.max(0, this.health - amount);
    }

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.root.rotation.z = Math.PI / 2.2;
    this.root.position.y = 0.35;
  }

  respawn(spawnPos, yaw = 0) {
    this.isDead = false;
    this.health = 100;
    this.armor = 100;
    this.position.copy(spawnPos);
    this.targetPos.copy(spawnPos);
    this.yaw = yaw;
    this.targetYaw = yaw;
    this.root.rotation.set(0, yaw, 0);
    this.root.position.copy(spawnPos);
  }

  destroy() {
    if (this.root && this.root.parent) {
      this.root.parent.remove(this.root);
    } else if (this.root) {
      this.scene.remove(this.root);
    }
  }
}

/**
 * Network packet adapter for the host application's room transport
 */
export class NetworkManager {
  constructor(game) {
    this.game = game;
    this.isHost = false;
    this.isConnected = false;
    this.isExternal = false;

    this.remotePlayer = null;
    this.syncInterval = null;
  }

  startExternalMatch(role) {
    if (role !== 'host' && role !== 'guest') return;
    this.disconnect(false);
    this.isExternal = true;
    this.isConnected = true;
    this.isHost = role === 'host';
    this.startP2PMatch();
  }

  startP2PMatch() {
    // Reset match scores for fresh P2P duel
    this.game.playerScore = 0;
    this.game.enemyScore = 0;
    this.game.ui.updateScores(0, 0);

    // Remove Bot AI from current match and spawn RemotePlayer
    if (this.game.bot) {
      this.game.scene.remove(this.game.bot.root);
      this.game.bot = null;
    }

    if (!this.remotePlayer) {
      this.remotePlayer = new RemotePlayer(this.game.scene, this.isHost);
    }
    this.game.weapons.targets = [this.remotePlayer];

    // Set UI mode tag
    this.game.ui.setModeTag(this.isHost ? 'ROOM HOST' : 'ROOM GUEST');

    // Launch UI & Open Pre-Round Weapon Selection
    this.game.ui.showMainMenu(false);
    this.game.ui.showHUD(true);
    this.game.openLoadoutSelect(true);

    // Publish player state at approximately 30Hz through the host transport.
    this.startSyncLoop();
  }

  startSyncLoop() {
    if (this.syncInterval) clearInterval(this.syncInterval);

    this.syncInterval = setInterval(() => {
      if (!this.isConnected || !this.isExternal || this.game.player.isDead) return;

      this.sendPacket({
        type: 'state',
        pos: [this.game.player.position.x, this.game.player.position.y, this.game.player.position.z],
        yaw: this.game.player.yaw,
        pitch: this.game.player.pitch,
        lean: this.game.player.currentLean,
        crouch: this.game.player.isCrouching,
        slot: this.game.weapons.currentSlot,
        health: this.game.player.health,
        armor: this.game.player.armor
      });
    }, 33); // ~30 FPS network tick
  }

  sendPacket(packet) {
    if (!this.isConnected || !this.isExternal) return;
    bridge.sendPacket(packet);
  }

  handlePacket(data) {
    if (!data || !data.type) return;

    switch (data.type) {
      case 'loadout_ready':
        this.game.handlePeerLoadoutReady(data);
        break;

      case 'state':
        if (this.remotePlayer) {
          this.remotePlayer.targetPos.set(data.pos[0], data.pos[1], data.pos[2]);
          this.remotePlayer.targetYaw = data.yaw;
          this.remotePlayer.pitch = data.pitch;
          this.remotePlayer.lean = data.lean;
          this.remotePlayer.isCrouching = data.crouch;
        }
        break;

      case 'fire':
        if (this.remotePlayer) {
          this.remotePlayer.playFireEffect();
          this.game.sound.playGunshot(data.weaponId);
        }
        break;

      case 'hit':
        // Host or peer took damage
        this.game.player.takeDamage(data.damage, this.remotePlayer ? this.remotePlayer.position : null);
        break;

      case 'p2p_elimination': {
        const iWon = (data.shooterIsHost === this.isHost);
        this.game.handleP2POutcome(iWon, data.isHeadshot, data.weapon, {
          isJumpShot: !!data.isJumpShot,
          isNoScope: !!data.isNoScope
        });
        break;
      }

      case 'rematch_confirm':
        this.game.handlePeerRematchConfirm();
        break;

      case 'rematch_exit':
        this.clearExternalMatch();
        this.game.handlePeerRematchExit();
        break;

      case 'reset_round':
        this.game.ui.hideGameOver();
        this.game.openLoadoutSelect(true);
        break;
    }
  }

  disconnect(notifyParent = true) {
    this.sendPacket({ type: 'rematch_exit' });
    if (notifyParent && this.isConnected && this.isExternal) {
      bridge.sendLeave();
    }

    // Hide loadout selection modal if open
    if (this.game && this.game.ui) {
      this.game.ui.showWeaponSelect(false);
    }

    // Stop sync loop
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    // Destroy remote player mannequin
    if (this.remotePlayer && Array.isArray(data.pos) && data.pos.length === 3
      && data.pos.every(Number.isFinite)
      && [data.yaw, data.pitch, data.lean].every(Number.isFinite)) {
      this.remotePlayer.destroy();
      this.remotePlayer = null;
    }

    this.isConnected = false;
    this.isExternal = false;
    this.isHost = false;
  }

  clearExternalMatch() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    if (this.remotePlayer) {
      this.remotePlayer.destroy();
      this.remotePlayer = null;
    }
    this.isConnected = false;
    this.isExternal = false;
  }

  update(dt) {
    if (this.remotePlayer) {
      this.remotePlayer.update(dt);
    }
  }
}
