Add-Type -AssemblyName System.Drawing

function Crop-Image($srcPath, $dstPath, $x, $y, $w, $h) {
    $img = [System.Drawing.Image]::FromFile($srcPath)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    Write-Host "Saved $dstPath"
}

# Ensure directory
New-Item -ItemType Directory -Force -Path "public\images\extracted"

# 1. Dark Mode Avatar: top-left Minecraft character with purple cube
Crop-Image "public\images\theme-dark.jpg" "public\images\extracted\avatar-dark.png" 0 45 145 145

# 2. Light Mode Avatar: top-left Minecraft character with sword & cape
Crop-Image "public\images\theme-light.jpg" "public\images\extracted\avatar-light.png" 0 45 145 145

# 3. Performers
# Astra Void - Grass Block
Crop-Image "public\images\theme-dark.jpg" "public\images\extracted\grass-block.png" 50 330 70 75
# Rift Echo - Diamond Block
Crop-Image "public\images\theme-dark.jpg" "public\images\extracted\diamond-block.png" 210 330 70 75
# Nova Dream - Creeper Face
Crop-Image "public\images\theme-dark.jpg" "public\images\extracted\creeper-face.png" 365 335 65 70

# 4. Games
# Basketball Stars image
Crop-Image "public\images\theme-dark.jpg" "public\images\extracted\game-basketball-stars.png" 12 546 142 100
# Mine Rush 3D image
Crop-Image "public\images\theme-dark.jpg" "public\images\extracted\game-mine-rush.png" 166 546 142 100
# Crossy Roads image
Crop-Image "public\images\theme-dark.jpg" "public\images\extracted\game-crossy-roads.png" 318 546 142 100

# 5. Paris et actualités
# Bundesliga soccer stadium
Crop-Image "public\images\theme-dark.jpg" "public\images\extracted\event-bundesliga.png" 14 782 234 94
# La Liga F1 car
Crop-Image "public\images\theme-dark.jpg" "public\images\extracted\event-laliga.png" 262 782 196 94

Write-Host "Extraction complete!"
