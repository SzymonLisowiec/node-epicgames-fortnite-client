module.exports = (stats) => {

    let result = {};
    
    for(let i in stats){

        let stat = stats[i];
        let parts = stat.name.match(/^(.*?)_(.*?)_(.*?)_(.*?)_(.*?)$/);

        if(parts.length === 6){

            let br = parts[1]; // It seems, that everytime is `br`. Maybe `br` means "Battle Royale", but the "Save the World" mode have separately statistics.
            let name = parts[2];
            let platform = parts[3];
            let m = parts[4]; // I don't know, what is this. It seems, that everytime is `m0`
            let mode = parts[5];

            switch (mode) {
                case 'p2': mode = 'solo'; break;
                case 'p10': mode = 'duo'; break;
                case 'p9': mode = 'squad'; break;
                default: console.log(new Error('Unknow mode of stat. Mode: ' + mode)); break;
            }

            if(typeof result[platform] === 'undefined')
                result[platform] = {};

            if(typeof result[platform][mode] === 'undefined')
                result[platform][mode] = {};

            if(name === 'lastmodified')
                stat.value = new Date(stat.value * 1000);

            result[platform][mode][name] = stat.value;

        }

    }

    return result;
};