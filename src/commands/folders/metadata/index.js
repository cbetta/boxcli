'use strict';

const BoxCommand = require('../../../box-command');

class FoldersGetAllMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FoldersGetAllMetadataCommand);

		let metadata = await this.client.folders.getAllMetadata(args.id);
		await this.output(metadata);
	}
}

FoldersGetAllMetadataCommand.aliases = [ 'folders:metadata:get-all' ];

FoldersGetAllMetadataCommand.description = 'Get all metadata on a folder';

FoldersGetAllMetadataCommand.flags = {
	...BoxCommand.flags
};

FoldersGetAllMetadataCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to get all metadata on',
	}
];

module.exports = FoldersGetAllMetadataCommand;
