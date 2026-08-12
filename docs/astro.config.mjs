// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	vite: {
		preview: {
			// Railway assigns a *.up.railway.app hostname; Vite blocks unknown hosts by default.
			allowedHosts: ['.railway.app', 'localhost'],
		},
	},
	integrations: [
		starlight({
			title: 'MedSupply Documentation',
			sidebar: [
				{
					label: 'Gebruikershandleiding',
					items: [
						{ label: 'Inleiding', slug: 'gebruikers/01-inleiding' },
						{ label: 'Wat is MedSupply Manager?', slug: 'gebruikers/02-wat-is-medsupply-managersystem' },
						{ label: 'Inloggen', slug: 'gebruikers/03-inloggen' },
						{ label: 'Het dashboard', slug: 'gebruikers/04-het-dashboard' },
						{ label: 'Aanvraag indienen', slug: 'gebruikers/05-aanvraag-indienen-page' },
						{ label: 'Totale voorraad bekijken', slug: 'gebruikers/06-totale-voorraad-bekijken' },
						{ label: 'Statistieken', slug: 'gebruikers/07-statistieken' },
						{ label: 'Geschiedenis', slug: 'gebruikers/08-geschiedenis' },
						{ label: 'Navigatie Overzicht', slug: 'gebruikers/09-navigatie-overzicht' },
						{ label: 'Wat mag jij doen? (Rollen)', slug: 'gebruikers/10-wat-mag-jij-doen-rollen' },
					],
				},
				{
					label: 'Systeemhandleiding',
					items: [
						{ label: '1. Inleiding', slug: 'systeem/01-inleiding' },
						{ label: '2. Systeemoverzicht', slug: 'systeem/02-systeemoverzicht' },
						{ label: '3. Systeemvereisten', slug: 'systeem/03-systeemvereisten' },
						{ label: '4. Installatie en configuratie', slug: 'systeem/04-installatie-en-configuratie' },
						{ label: '5. Architectuur', slug: 'systeem/05-architectuur' },
						{ label: '6. Beveiliging', slug: 'systeem/06-beveiliging' },
						{ label: '7. Bekende beperkingen', slug: 'systeem/07-bekende-beperkingen' },
						{ label: '8. Aanbevelingen', slug: 'systeem/08-aanbevelingen' },
						{ label: '9. Literatuurlijst', slug: 'systeem/09-literatuurlijst' },
					],
				},
			],
		}),
	],
});
