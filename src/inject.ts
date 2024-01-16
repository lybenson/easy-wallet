window.easy = {
  request: (args: RequestArguments) => {
    console.log(args.method)
    chrome.runtime.sendMessage(args)
  }
}
