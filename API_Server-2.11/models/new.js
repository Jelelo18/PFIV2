module.exports = 
class News{
    constructor(userId, title, imageGUID, text)
    {
        this.Id = 0;
        this.UserId = userId !== undefined ? userId : "";
        this.Title = title !== undefined ? title : "";
        this.ImageGUID = imageGUID !== undefined ? imageGUID : "";
        this.Text = text !== undefined ? text : "";
        this.Created = 0;
    }

    static valid(instance) {
        const Validator = new require('./validator');
        let validator = new Validator();
        validator.addField('Id','integer');
        validator.addField('Title','string');
        validator.addField('Text','string');
        return validator.test(instance);
    }
}