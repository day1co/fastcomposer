<template>
  <li class="composer-listitem-layout composer-listitem">
    <span class="composer-listitem-icon">
      <img :src="'data:image/svg+xml;utf8,' + encodeURIComponent(layout?.meta?.icon)" />
      <!--svg width="40" height="40">
        <rect x="0.5" y="0.5" width="39" height="39" fill="none" stroke="red" stroke-opacity="0.25" />
        <circle cx="16" cy="16" r="10" fill="#ddd" />
        <rect x="18" y="18" width="16" height="16" fill="#aaa" />
      </svg-->
    </span>
    <label>
      <strong> {{ layout?.id }} </strong>
      <br />
      {{ layout?.meta?.description }}
    </label>
    <slot></slot>
  </li>
</template>

<script>

export default {
  props: {
    layout: Object
  }
}

</script>
