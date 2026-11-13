<script>
    export let icon;
    export let width = 24;
    export let height = 24;
    export let className = '';
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    {width}
    {height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={className}
    aria-hidden="true"
    focusable="false"
>
    {#if icon === 'ph:lightning'}
        <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" fill="currentColor" stroke="none"/>
    {:else if icon === 'line-md:volume-high-twotone'}
        <path d="M11 5 6 9H3v6h3l5 4V5Z"/>
        <path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/>
    {:else if icon === 'line-md:volume-remove-twotone'}
        <path d="M11 5 6 9H3v6h3l5 4V5Z"/>
        <path d="m16 9 5 6m0-6-5 6"/>
    {:else if icon === 'material-symbols:keyboard-onscreen-outline-rounded'}
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 15h8"/>
    {:else}
        <path d="M12 3 9 5H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-3l-3-2Z"/>
        <circle cx="9" cy="11" r="1"/>
        <circle cx="15" cy="11" r="1"/>
        <path d="M8 15h8"/>
    {/if}
</svg>
