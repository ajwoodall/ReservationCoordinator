module.exports = {
    genCustRequests: function(n) {
        var letters = "ABCDEFGHIJKLMNOP";
        var requests = {};

        for (var i=0; i<n; i++) {
            do {
                var c1 = letters[parseInt(letters.length * Math.random())];
                var c2 = letters[parseInt(letters.length * Math.random())];
            } while (c1 == c2);

            if (!requests[c1 + c2] && !requests[c2 + c1]) {
                requests[c1 + c2] = {
                    besthopsandcost: {hops: 0, cost: 0},
                    besthopsandcostagentid: 0,
                    besthopsandcostreservationid: 0,
                    bestagenthopsandcost: {}
                }
            } else {
                i--;
            }
        }

        return requests;
    },
    disconnectCount: function(agents, providers, currentGameStatus) {
        var i;
        var now;
        var last;
        var badAgents = [];
        var badProviders = [];
        var goodAgents = [];
        var goodProviders = [];

        for (var a in agents) {
            now = new Date().getTime();
            last = agents[a].lastpingtime.getTime();
            // check agent ping times
            if (now - last > (process.env.DELETEAGENTTIMER/2)) {
                agents[a].lasterrcount++;
                if (agents[a].active) {
                    agents[a].active = false;
                    console.log("*** Setting Agent " + a + " stale ***");
                }

                badAgents.push(a);
            } else {
                agents[a].lasterrcount = 0;
                agents[a].active = true;
                goodAgents.push(a);
            }
        }

        for (var p in providers) {
            now = new Date().getTime();
            last = providers[p].lastpingtime.getTime();
            // check provider ping times
            if (now - last > (process.env.DELETEPROVIDERTIMER/2)) {
                providers[p].lasterrcount++;
                if (providers[p].active) {
                    providers[p].active = false;
                    console.log("*** Setting Provider " + p + " stale ***");
                }

                badProviders.push(p);
            } else {
                providers[p].lasterrcount = 0;
                providers[p].active = true;
                goodProviders.push(p);
            }
        }

        return {"badAgents": badAgents, "badProviders": badProviders, "goodAgents": goodAgents, "goodProviders": goodProviders};
    },
    readyCount: function(agents, providers) {
        var agentList = Object.keys(agents);
        var providerList = Object.keys(providers);
        var i;

        var agentsReady = [];
        var agentsNotReady = [];
        for (i=0; i<agentList.length; i++) {
            var a = agents[agentList[i]];
            if (a.active) {
                if (a.ready) {
                    agentsReady.push(a);
                } else {
                    agentsNotReady.push(a);
                }
            }
        }

        var providersReady = [];
        var providersNotReady = [];
        for (i=0; i<providerList.length; i++) {
            var p = providers[providerList[i]];
            if (p.active) {
                if (p.lasterrcount == 0) {
                    providersReady.push(p);
                } else {
                    providersNotReady.push(p);
                }
            }
        }

        return {"agentsReady": agentsReady, "agentsNotReady": agentsNotReady, "providersReady": providersReady, "providersNotReady": providersNotReady};
    }
};