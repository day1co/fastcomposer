<template>
  <li class="composer-listitem-layer composer-listitem">
    <span class="composer-listitem-icon">
      <svg width="40" height="40">
        <rect x="0.5" y="0.5" width="39" height="39" fill="none" stroke="red" stroke-opacity="0.25" />
        <circle cx="16" cy="16" r="10" fill="#ddd" />
        <rect x="18" y="18" width="16" height="16" fill="#aaa" />
      </svg>
    </span>
    <label>
      <strong> {{ layer.layout.id }} </strong>
      <br />
      {{ layer.layout.meta.description }}
    </label>
    <slot></slot>
  </li>
</template>

<script>

export default {
  props: {
    layer: Object
  }
}

</script>
