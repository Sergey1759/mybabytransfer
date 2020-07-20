function get_arrive_date(date, time_order) {
    let date_ = new Date(date).getTime() + time_order * 1000;
    return new Date(date_)
}
module.exports = get_arrive_date;