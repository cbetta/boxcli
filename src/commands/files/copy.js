'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class FilesCopyCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesCopyCommand);
		let options = {};

		if (flags.name) {
			options.name = flags.name;
		}
		if (flags.version) {
			options.version = flags.version;
		}

		let fileCopy = await this.client.files.copy(args.id, args.parentID, options);
		await this.output(fileCopy);
	}
}

FilesCopyCommand.description = 'Copy a file to a different folder';

FilesCopyCommand.flags = {
	...BoxCommand.flags,
	name: flags.string({ description: 'New name for the file' }),
	version: flags.string({ description: 'File version ID if you want to copy a specific file version' }),
	'id-only': flags.boolean({ description: 'Output only the ID of the file copy '}),
};

FilesCopyCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to copy'
	},
	{
		name: 'parentID',
		required: true,
		hidden: false,
		description: 'ID of the new parent folder to copy the file into'
	}
];

module.exports = FilesCopyCommand;
