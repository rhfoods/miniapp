

Component({
  data: {},
  properties: {
    // className='map'
    id: {
      type: String,
      value: 1,
      observer: function(newData, oldData) {
        console.log(newData, '---------- newData')
      }
    },
    style: String,
    markers: Array,
    latitude: Number,
    longitude: Number,
    scale: Number,
    layerStyle: {
      type: Number,
      value: 1,
      observer: function(n,o) {
        console.log(n, o, '-------------- n o')
      }
    },
    showLocation: Boolean,
    subkey: String,
  },
  onload() {
    console.log('----1')
  },
  methods: {
    markertap(e) {
      // const psaveId = e.detail.markerId;
    },
    callouttap() {

    },
    regionchange() {
      // this.triggerEvent('regionchange')
    },
    updated() {
      // this.triggerEvent('updated')

    },
  },
});
