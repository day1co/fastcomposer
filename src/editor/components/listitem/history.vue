<template>
  <li class="composer-listitem-history composer-listitem">
    <span class="composer-listitem-icon">
      <svg width="24" height="24">
        <rect x="0.5" y="0.5" width="23" height="23" fill="none" stroke="red" stroke-width="1" />
      </svg>
    </span>
    <label>
      {{ act.action }}
    </label>
    <slot></slot>
  </li>
</template>

<script>

export default {
  props: {
    act: Object
  }
}

</script>
