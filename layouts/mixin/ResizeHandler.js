import store from '@/store'

const WIDTH = 1024;
const RATIO = 3;

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        this.$store.dispatch('closeSideBar', {withoutAnimation: false})
      }
    }
  },
  //
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },

  mounted() {
    const isMobile = this.isMobile();
    if (isMobile) {
      this.$store.dispatch('toggleDevice', 'mobile');
      this.$store.dispatch('closeSideBar', {withoutAnimation: true})
    }
  },
  methods: {
    isMobile() {
      const rect = document.body.getBoundingClientRect();
      return rect.width - RATIO < WIDTH
    },
    resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.isMobile();
        this.$store.dispatch('toggleDevice', isMobile ? 'mobile' : 'desktop');

        if (isMobile) {
          this.$store.dispatch('closeSideBar', {withoutAnimation: true})
        }
      }
    }
  }
}
