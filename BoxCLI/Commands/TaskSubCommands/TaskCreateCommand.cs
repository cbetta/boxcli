﻿using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Box.V2.Models;
using Microsoft.Extensions.CommandLineUtils;
using BoxCLI.CommandUtilities;

namespace BoxCLI.Commands.TaskSubCommands
{
    public class TaskCreateCommand : TaskSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _message;
        private CommandOption _due;
        private CommandLineApplication _app;
        public TaskCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a task on a file.";
            _fileId = command.Argument("fileId",
                                   "Id of file");
            _message = command.Option("--message", "Message for task.", CommandOptionType.SingleValue);
            _due = command.Option("--due-at", "When this task is due, use format 05h for 5 hours for example.", CommandOptionType.SingleValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunCreate();
            return await base.Execute();
        }

        private async Task RunCreate()
        {
            base.CheckForValue(this._fileId.Value, this._app, "A file ID is required for this command");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var taskRequest = new BoxTaskCreateRequest();
            taskRequest.Item = new BoxRequestEntity()
            {
                Id = this._fileId.Value
            };
            if (this._message.HasValue())
            {
                taskRequest.Message = this._message.Value();
            }
            if (this._due.HasValue())
            {
                taskRequest.DueAt = GeneralUtilities.GetDateTimeFromString(this._due.Value());
            }

            base.PrintTask(await boxClient.TasksManager.CreateTaskAsync(taskRequest));
        }
    }
}