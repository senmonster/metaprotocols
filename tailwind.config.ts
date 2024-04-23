import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: "#E0E8F8",
				},
			},
		],
	},
	theme: {
		extend: {
			colors: {
				white: "#fff",
				black: "#141414",
				// dark: "#1E1E1E",
				// blueDark: "#0202E7",
				// blueLight: "#056DFA",
				// blueBg: "#122137",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
		container: {
			center: true,
			screens: {
				"2xl": "1280px",
			},
		},
	},
	// eslint-disable-next-line no-undef
	plugins: [require("daisyui")],
};
export default config;
