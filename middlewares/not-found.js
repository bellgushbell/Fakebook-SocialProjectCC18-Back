
module.exports = (req, res, next) => {


    res.status(404).json({ msg: "service path not found" })
}