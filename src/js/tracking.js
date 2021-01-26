/**
 * Tracking JS
 *
 * For placing analytics and tracking scripts.
 *
 * @copyright 2021 NB Communication Ltd
 *
 */

const body$1 = uk.$('body');
if (body$1) {

	// Analytics
	// Matomo and Google
	const analytics = {

		init: () => {

			const data = nb.data(body$1, 'analytics', true);
			if (uk.isEmpty(data)) return;

			if (data.matomo) {
				this.matomo(data.matomo);
			}

			if (data.google && uk.isPlainObject(data.google)) {

				if (nb.cookieConsent('analytics')) {
					this.google(data.google);
				}

				// Handle consent setting switch
				nb.cookieConsent('analytics', (consent) => {
					if (consent) {
						analytics.google(data.google);
					} else {
						window['ga-disable-GA_MEASUREMENT_ID'] = true;
						uk.remove(uk.$('#script-analytics'));
					}
				});
			}
		},

		google: (config) => {
			nb.loadScript({
				async: true,
				id: 'script-analytics',
				src: `https://www.googletagmanager.com/gtag/js?id=${config.id}`
			});
			window.dataLayer = window.dataLayer || [];
			function gtag() {dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', config.id, (uk.isObject(config.options) ? config.options : {}));
		},

		matomo: (id) => {
			const url = 'https://nbstats.co.uk/';
			window._paq = window._paq || [];
			if (!nb.cookieConsent('analytics')) _paq.push(['disableCookies']);
			_paq.push(['trackPageView']);
			_paq.push(['enableLinkTracking']);
			_paq.push(['setTrackerUrl', `${url}matomo.php`]);
			_paq.push(['setSiteId', id]);
			nb.loadScript({
				async: true,
				defer: true,
				id: 'script-matomo',
				src: `${url}matomo.js`
			});
		}
	};

	analytics.init();
}
