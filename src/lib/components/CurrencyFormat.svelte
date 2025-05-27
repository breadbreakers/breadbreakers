<script>
  export let value = 0; // The number to format
  export let currency = 'SGD'; // Currency code, e.g., 'USD', 'SGD'
  export let locale = 'en-US'; // Locale, e.g., 'en-US', 'en-SG'

  $: formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
</script>

<span>{formatted}</span>
