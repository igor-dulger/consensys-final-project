class Helpers {

    stopWatchers(events) {
        for (var key in events) {
            if (key) {
                events[key].stopWatching()
            }
        }
    }
}

export default new Helpers()
