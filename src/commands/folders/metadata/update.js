'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const utils = require('../../../util');

const OP_FLAGS = Object.freeze({
	add: true,
	copy: true,
	move: true,
	remove: true,
	replace: true,
	test: true,
});

class FoldersUpdateMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args, raw } = this.parse(FoldersUpdateMetadataCommand);

		let updates = raw.filter(v => v.type === 'flag' && OP_FLAGS[v.flag]).map(op => {
			let opName = op.flag;
			let opData = flags[op.flag].shift();

			return { op: opName, ...opData };
		});

		let templateKey = flags['template-key'];

		let metadata = await this.client.folders.updateMetadata(args.id, flags.scope, templateKey, updates);
		await this.output(metadata);
	}
}

FoldersUpdateMetadataCommand.description = 'Update the metadata attached to a folder';

FoldersUpdateMetadataCommand.flags = {
	...BoxCommand.flags,
	scope: flags.string({
		description: 'The scope of the metadata template to update against',
		default: 'enterprise',
	}),
	'template-key': flags.string({
		description: 'The key of the metadata template to update against',
		required: true,
	}),
	add: flags.string({
		char: 'a',
		description: 'Add a key to the metadata document; must be in the form key=value',
		multiple: true,
		parse: utils.parseMetadataOp,
	}),
	copy: flags.string({
		char: 'c',
		description: 'Copy a metadata value to another key; must be in the form sourceKey>destinationKey',
		multiple: true,
		parse: utils.parseMetadataOp,
	}),
	move: flags.string({
		char: 'm',
		description: 'Move a metadata value from one key to another; must be in the form sourceKey>destinationKey',
		multiple: true,
		parse: utils.parseMetadataOp,
	}),
	remove: flags.string({
		description: 'Remove a key from the metadata document',
		multiple: true,
		parse: utils.parseMetadataOp,
	}),
	replace: flags.string({
		description: 'Replace the value of an existing metadata key; must be in the form key=value',
		multiple: true,
		parse: utils.parseMetadataOp,
	}),
	test: flags.string({
		char: 't',
		description: 'Test that a metadata key contains a specific value; must be in the form key=value',
		multiple: true,
		parse: utils.parseMetadataOp,
	}),
};

FoldersUpdateMetadataCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to update metadata on',
	}
];

module.exports = FoldersUpdateMetadataCommand;
