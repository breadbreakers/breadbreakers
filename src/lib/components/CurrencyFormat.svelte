<script>
  export let value = 0;
  export let currency = 'SGD';
  export let locale = 'en-US';

  $: formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
</script>

<span>{formatted}</span>
