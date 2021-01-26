/**
 * Main JS
 *
 * @copyright 2021 NB Communication Ltd
 *
 */

const main = {

	init: () => {

		nb.profilerStart('main.init');

		// Content
		const blocks = uk.$$('.content');
		if (blocks.length) {

			blocks.forEach((block) => {

				// Apply UIkit table component
				uk.$$('table', block).forEach((el) => {
					uk.addClass(el, 'uk-table');
					uk.wrapAll(el, '<div class="uk-overflow-auto">');
				});

				// Inline Images UIkit Lightbox/Scrollspy
				(uk.$$('a[href]', block).filter((a) => {
					return uk.attr(a, 'href').match(/\.(jpg|jpeg|png|gif|webp)/i);
				})).forEach((a) => {

					const figure = a.parentElement;
					if (figure.nodeName !== 'FIGURE') {
						uk.wrapAll(a, '<figure>');
						figure = a.parentElement;
					}

					const img = uk.$('img', a);
					if (uk.hasAttr(img, 'class')) {
						uk.addClass(figure, uk.attr(img, 'class'));
						uk.removeAttr(img, 'class');
					}

					const caption = uk.$('figcaption', figure);

					// uk-lightbox
					uk.attr(figure, 'data-uk-lightbox', 'animation: fade');
					if (caption) uk.attr(a, 'data-caption', nb.wrap(uk.html(caption), 'div'));
				});
			});
		}

		nb.profilerStop('main.init');
	},

	render: {

		items: (items, config) => {

			nb.profilerStart('main.render.items');

			const fieldsDetail = ['date_pub', 'dates', 'location'];
			const clsTag = 'uk-label uk-label-primary uk-margin-small-right';

			let out = '';
			for (let i = 0, item, details, tags; i < items.length; i++) {

				item = items[i];

				// Details
				details = '';
				for (let j = 0, k, v; j < fieldsDetail.length; j++) {
					k = fieldsDetail[j];
					v = k in item ? item[k] : '';
					if (v) details += nb.wrap(v, 'uk-text-meta');
				}

				// Tags
				tags = '';
				if (config.showTemplate && item.template) {
					tags += nb.wrap(uk.ucfirst(item.template), clsTag);
				}
				if ('tags' in item && Array.isArray(item.tags)) {
					item.tags.forEach((tag) => {
						tags += nb.wrap(tag.title, clsTag);
					});
				}

				out += nb.wrap(
					nb.wrap(
						// Image
						(item.getImage ? nb.wrap(
							nb.link(
								item.url,
								nb.img(item.getImage, {
									alt: item.title,
									sizes: '(min-width: 640px) 50.00vw',
								})
							),
							'uk-card-media-top'
						) : '') +
						// Title / Details / Tags
						nb.wrap(
							nb.wrap(
								nb.link(item.url, item.title, 'uk-link-reset'),
								'uk-card-title'
							) +
							details +
							tags,
							'uk-card-header'
						) +
						// Summary
						(item.getSummary ? nb.wrap(
							nb.wrap(item.getSummary, 'p'),
							'uk-card-body'
						) : '') +
						// CTA
						(config.cta ? nb.wrap(
							nb.link(item.url, config.cta, 'uk-button uk-button-text'),
							'uk-card-footer'
						) : ''),
						'uk-card uk-card-default'
					),
					'div'
				);
			}

			out = nb.wrap(out, {
				class: [
					'uk-child-width-1-2@s',
					'uk-child-width-1-3@m',
					'uk-grid-match',
					'uk-flex-center',
				],
				dataUkGrid: true,
				dataUkScrollspy: {
					target: '> div',
					cls: 'uk-animation-slide-bottom-small',
					delay: NBkit.options.duration / 4,
				}
			}, 'div');

			nb.profilerStop('main.render.items');

			return out;
		}
	}
};

uk.ready(() => main.init());

function renderItems(items, config) {
	return main.render.items(items, config);
}
