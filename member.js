function skillsMember() {
    var self = this;
    self.skills = ko.observableArray([
        { name: 'JavaScript', type: 'programming', level: 'intermediate' },
        { name: 'HTML', type: 'markup', level: 'intermediate' },
        { name: 'CSS', type: 'markup', level: 'intermediate' }
    ]);
}