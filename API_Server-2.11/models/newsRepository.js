const Repository = require('./repository');
const ImageFilesRepository = require('./imageFilesRepository.js');
const News = require('./new.js');
const utilities = require("../utilities");
module.exports = 
class NewsRepository extends Repository {
    constructor(req){
        super('News', true);
        this.users = new Repository('Users');
        this.req = req;
        this.setBindExtraDataMethod(this.bindUsernameAndImageURL);
    }
    bindUsernameAndImageURL(news){
        if (news) {
            let user = this.users.get(news.UserId);
            let username = "unknown";
            if (user !== null)
                username = user.Name;
            let bindedNews = {...news};
            bindedNews["Username"] = username;
            bindedNews["Date"] = utilities.secondsToDateString(news["Created"]);
            if (news["ImageGUID"] != ""){
                bindedNews["ImageURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(news["ImageGUID"]);
            } else {
                bindedNews["ImageURL"] = "";
            }
            return bindedNews;
        }
        return null;
    }
    add(news) {
        news["Created"] = utilities.nowInSeconds();
        console.log(news);
        if (News.valid(news)) {
            news["ImageGUID"] = ImageFilesRepository.storeImageData("", news["ImageData"]);
            delete news["ImageData"];
            return super.add(news);
        }
        return null;
    }
    update(news) {
        news["Created"] = utilities.nowInSeconds();

        if (News.valid(news)) {
            let foundNews = super.get(news.Id);
            if (foundNews != null) {
                news["ImageGUID"] = ImageFilesRepository.storeImageData(news["ImageGUID"], news["ImageData"]);
                delete news["ImageData"];
                return super.update(news);
            }
        }
        return false;
    }
    remove(id){
        let foundNews = super.get(id);
        if (foundNews) {
            ImageFilesRepository.removeImageFile(foundNews["ImageGUID"]);
            return super.remove(id);
        }
        return false;
    }
}