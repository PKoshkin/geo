function Force(vector) {
    var self = this;
    self.power = get_length(vector);
    normalize(vector);
    self.direction = vector;

    self.decrease = function() {
        self.power -= 5;
    }
}
