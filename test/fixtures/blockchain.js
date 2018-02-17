export let testBlockchain = [{
  "N": 0,
  "prevBlockHash": 0,
  "transactions": [{
    "from": "reward",
    "to": "MEgCQQCVjANn/rmmX75eUPiSJyObigG7DOpub0s8EEY6TofP7gyFWdFcJSYwrzrG3Xj4rdwlDMKojuq9sgCeMxoGPpVjAgMBAAE=",
    "amount": 10,
    "time": 1517728637428,
    "hash": "5e3c47000f23f6eaacc8355aecf146fbebd29b9b5c50f76f5f384364ce4d2886"
  }],
  "time": 1517728637428,
  "nonce": 0,
  "blockHash": "f250f046ccd9c40ff66dccf06fde2bb432b145b61388ffe2dee8c9930510cc01"
}, {
  "N": 1,
  "prevBlockHash": "f250f046ccd9c40ff66dccf06fde2bb432b145b61388ffe2dee8c9930510cc01",
  "transactions": [{
    "from": "MEgCQQCVjANn/rmmX75eUPiSJyObigG7DOpub0s8EEY6TofP7gyFWdFcJSYwrzrG3Xj4rdwlDMKojuq9sgCeMxoGPpVjAgMBAAE=",
    "to": "MEgCQQDrpV0KEHfUiAMaZE72lWwh6X4wLPHrl+Sq4Q7R+nPAmuQvaVnI4zDaXuh6KxiK7odiU77iL5dpTINeYEY3v18BAgMBAAE=",
    "amount": 5,
    "time": 1517728637428,
    "hash": "5ad0763f0270168e34961a6427e747c635dc8e2d3356b3035a7a482ce76325ca",
    "signature": "hGRPj9uCkRLNd/2KSP3QPZ7sYo8SqLbWlGDgEIidW4NZy4pAfdvfXvKT0Ynta5o17uyUhvzkvhWPl45EGCY84A=="
  }, {
    "from": "reward",
    "to": "MEgCQQCVjANn/rmmX75eUPiSJyObigG7DOpub0s8EEY6TofP7gyFWdFcJSYwrzrG3Xj4rdwlDMKojuq9sgCeMxoGPpVjAgMBAAE=",
    "amount": 10,
    "time": 1517728637428,
    "hash": "5e3c47000f23f6eaacc8355aecf146fbebd29b9b5c50f76f5f384364ce4d2886",
    "signature": "feUbjf/F3SWh+BHjGlqYIoYbNgSCZ5CUqUp2yW8AsEqoNgloinXJOE3uSOeidQt/9337llY/BbfKVuXNsR/sZQ=="
  }],
  "time": 1517728637443,
  "nonce": -3572132205838397,
  "blockHash": "7ccc72bf734cf70abb9dd95ca50e7d5dc2deda0d0afc10a505e6fbacbdedf4ae"
}, {
  "N": 2,
  "prevBlockHash": "7ccc72bf734cf70abb9dd95ca50e7d5dc2deda0d0afc10a505e6fbacbdedf4ae",
  "transactions": [{
    "from": "MEgCQQCVjANn/rmmX75eUPiSJyObigG7DOpub0s8EEY6TofP7gyFWdFcJSYwrzrG3Xj4rdwlDMKojuq9sgCeMxoGPpVjAgMBAAE=",
    "to": "MEgCQQDfsLRqC/QREq3cOapuwjRdcIbbRVCIW1dV1cwxVRZHAd+rCwc0NoeTSQfMMvplRa4Bc8M8LJEALEJqnYP28eKvAgMBAAE=",
    "amount": 8,
    "time": 1517728637443,
    "hash": "cea166653a7cdbc9a9524551784dfde982abda2fe5c7751b4adc712f65646b73",
    "signature": "QFh9gp6dxgAE+RIksOV6PGm7akTscK0VmdMVKWRE1FO42rLh1UiqzdWzSJ1Ya0juBjNMFRPidBTaqHI+aUfl3A=="
  }, {
    "from": "reward",
    "to": "MEgCQQCVjANn/rmmX75eUPiSJyObigG7DOpub0s8EEY6TofP7gyFWdFcJSYwrzrG3Xj4rdwlDMKojuq9sgCeMxoGPpVjAgMBAAE=",
    "amount": 10,
    "time": 1517728637443,
    "hash": "1a0cc1070629eb52efdb22f4f68ee1fc60471dc0cb8d1bef365f64e6964e0ce3",
    "signature": "WuWbPbmJEZxypu8HfWSetVWbzaQufqOD8O+3SZ1JeUMbQFqW5epBH31BiOlWGxD15OyBTjv+jks+fSpwjhVSgw=="
  }],
  "time": 1517728637462,
  "nonce": 3622038354245946,
  "blockHash": "7edb70f8d84d8fcc0ff840230e9b3792e97f7fd103a801b10749637a68be09fa"
}];

export let testBalances = {
  "reward": -30,
  "MEgCQQCVjANn/rmmX75eUPiSJyObigG7DOpub0s8EEY6TofP7gyFWdFcJSYwrzrG3Xj4rdwlDMKojuq9sgCeMxoGPpVjAgMBAAE=": 17,
  "MEgCQQDrpV0KEHfUiAMaZE72lWwh6X4wLPHrl+Sq4Q7R+nPAmuQvaVnI4zDaXuh6KxiK7odiU77iL5dpTINeYEY3v18BAgMBAAE=": 5,
  "MEgCQQDfsLRqC/QREq3cOapuwjRdcIbbRVCIW1dV1cwxVRZHAd+rCwc0NoeTSQfMMvplRa4Bc8M8LJEALEJqnYP28eKvAgMBAAE=": 8
};

export default testBlockchain;
