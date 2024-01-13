<script lang="ts">
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md'
  export let style: Status | 'primary' | 'secondary' | 'danger' = 'primary'

  const sizeClasses = {
    xs: "px-1 text-2xs  rounded [line-height:0.55rem]",
    sm: "px-2 text-xs   rounded",
    md: "px-2 text-sm   rounded-md",
    lg: "px-3 text-base rounded-lg",
  }

  const styleClasses = {
    primary:   "bg-slate-600 border-slate-900 text-white",
    secondary: "bg-slate-200 border-slate-500 text-slate-800",
    danger:    "bg-red-600   border-red-800   text-white",
    pending:   "bg-yellow-400 border-yellow-600 text-yellow-800",
    modified:  "",
    nothing:   "",
    done:      "",
  }

  styleClasses.modified = styleClasses.danger
  styleClasses.nothing  = styleClasses.primary
  styleClasses.done     = styleClasses.primary
</script>


<button class="inline-block {sizeClasses[size]} {styleClasses[style]} transition-colors py-[0.2rem] border"
  type="button"
  on:click>
  <slot />
</button>
