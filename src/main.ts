import {App, Modal, Plugin, PluginSettingTab, Setting, TFile} from 'obsidian';
import ElectronGoogleOAuth2 from "@getstation/electron-google-oauth2";

const SCOPES = ['https://www.googleapis.com/auth/documents']

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class ObsidianShare extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('dice', 'Share Document', async () => {
			const link = await this.shareDocument()
			new ResultModal(this.app, link).open()
		});

		this.addSettingTab(new ObsidianShareSettingTab(this.app, this));
	}

	async createDocument({ title, token, data }: {title: string, token: string, data: string}) {
		console.log(title, token)
		console.log(data)

		let requestBody = {
			title: title
		};

		let response = await fetch('https://docs.googleapis.com/v1/documents?access_token=${token}', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(requestBody)
		});

		let result = await response.json();

		return result.data
	}

	async shareDocument() {
		const activeFile = this.getActiveFile()
		const data = await this.readFileData(activeFile)
		const token = await this.login()
		const title = activeFile.basename

		const result = await this.createDocument({ data, title, token})

		console.log(result)


		return 'link'
	}

	async login() {
		const api = new ElectronGoogleOAuth2(
			'CLIENT_ID',
			'CLIENT_SECRET',
			SCOPES
		);

		const credentials = await api.openAuthWindowAndGetTokens()

		return credentials.access_token
	}

	onunload() {
		console.log('unloading plugin');
	}

	getActiveFile() {
		return this.app.workspace.getActiveFile()
	}

	async readFileData(file: TFile) {
		return this.app.vault.read(file)
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class ResultModal extends Modal {
	link: string

	constructor(app: App, link: string) {
		super(app);
		this.link = link
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText(this.link);
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class ObsidianShareSettingTab extends PluginSettingTab {
	plugin: ObsidianShare;

	constructor(app: App, plugin: ObsidianShare) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue('')
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
