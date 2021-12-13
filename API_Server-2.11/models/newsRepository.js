const Repository = require('./repository');
const ImageFilesRepository = require('./imageFilesRepository.js');
const News = require('./new.js');
const utilities = require("../utilities");
module.exports = 
class NewsRepository extends Repository {
    constructor(req){
        super('News', true);
        this.req = req;
    }
    bindImageURL(news){
        console.log(news);
        if (news) {
            let bindedNews = {...news};
            if (news["ImageGUID"] != ""){
                bindedNews["ImageURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(news["ImageGUID"]);
            } else {
                bindedNews["ImageURL"] = "";
            }
            return bindedNews;
        }
        return null;
    }
    bindImageURLS(images){
        let bindedNews = [];
        for(let image of images) {
            bindedNews.push(this.bindImageURL(image));
        };
        console.log(bindedNews)
        return bindedNews;
    }
    get(id) {
        return this.bindImageURL(super.get(id));
    }
    getAll() {
        return this.bindImageURLS(super.getAll());
    }
    add(news) {
        news["Created"] = utilities.nowInSeconds();
        console.log(news);
        if (News.valid(news)) {
            news["ImageGUID"] = ImageFilesRepository.storeImageData("", news["ImageData"]);
            delete news["ImageData"];
            return this.bindImageURL(super.add(news));
        }
        return null;
    }
    update(user) {
        user["Created"] = 0; // will take the original creation date, see lower
        if (User.valid(user)) {
            let foundUser = super.get(user.Id);
            if (foundUser != null) {
                user["Created"] = foundUser["Created"];
                user["AvatarGUID"] = ImageFilesRepository.storeImageData(user["AvatarGUID"], user["ImageData"]);
                delete user["ImageData"];
                
                return super.update(user);
            }
        }
        return false;
    }
    remove(id){
        let foundUser = super.get(id);
        if (foundUser) {
            ImageFilesRepository.removeImageFile(foundUser["AvatarGUID"]);
            return super.remove(id);
        }
        return false;
    }
}