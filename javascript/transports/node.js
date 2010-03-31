Faye.NodeHttpTransport = Faye.Class(Faye.Transport, {
  request: function(message, callback, scope) {
    var request = this.createRequest();
    request.write(JSON.stringify(message));
    
    request.addListener('response', function(response) {
      if (!callback) return;
      Faye.withDataFor(response, function(data) {
        callback.call(scope, JSON.parse(data));
      });
    });
    request.close();
  },
  
  createRequest: function() {
    var uri    = url.parse(this._endpoint),
        client = http.createClient(uri.port, uri.hostname);
        
    return client.request('POST', uri.pathname, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  }
});

Faye.NodeHttpTransport.isUsable = function(endpoint) {
  return typeof endpoint === 'string';
};

Faye.Transport.register('long-polling', Faye.NodeHttpTransport);

Faye.NodeLocalTransport = Faye.Class(Faye.Transport, {
  request: function(message, callback, scope) {
    this._endpoint.process(message, true, function(response) {
      callback.call(scope, response);
    });
  }
});

Faye.NodeLocalTransport.isUsable = function(endpoint) {
  return endpoint instanceof Faye.Server;
};

Faye.Transport.register('in-process', Faye.NodeLocalTransport);

