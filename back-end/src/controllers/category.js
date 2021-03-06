const Category = require("../models/category");
const slugify = require("slugify");

const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
};
module.exports.create = (req, res) => {
  const { name, parentId } = req.body;
  const categoryObj = {
    name: name,
    slug: slugify(name),
  };

  if (parentId) {
    categoryObj.parentId = parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((err, newCat) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (newCat) {
      return res.status(201).json({ newCat });
    }
  });
};

module.exports.getCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (categories) {
      const categoryList = createCategories(categories);
      res.status(200).json({ categoryList });
    }
  });
};
