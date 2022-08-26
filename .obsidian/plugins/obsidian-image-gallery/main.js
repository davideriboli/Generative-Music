/* Obsidian Image Gallery Community plugin: https://github.com/lucaorio/obsidian-image-gallery */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
__export(exports, {
  default: () => ImgGallery
});
var import_obsidian2 = __toModule(require("obsidian"));

// src/img-gallery-renderer.ts
var import_obsidian = __toModule(require("obsidian"));
var imgGalleryRenderer = class extends import_obsidian.MarkdownRenderChild {
  constructor(plugin, src, container, app) {
    super(container);
    this.plugin = plugin;
    this.src = src;
    this.container = container;
    this.app = app;
    this._gallery = null;
    this._settings = {};
    this._imagesList = [];
  }
  onload() {
    return __async(this, null, function* () {
      this._getSettings();
      this._getImagesList();
      if (this._settings.type === "horizontal")
        this._injectHorMasonry();
      else
        this._injectVerMasonry();
    });
  }
  onunload() {
    return __async(this, null, function* () {
      if (this._gallery) {
        this._gallery.remove();
        this._gallery = null;
      }
    });
  }
  _getSettings() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const settingsObj = (0, import_obsidian.parseYaml)(this.src);
    if (settingsObj === void 0) {
      const error = "Cannot parse YAML!";
      this._renderError(error);
      throw new Error(error);
    }
    if (!settingsObj.path) {
      const error = "Please specify a path!";
      this._renderError(error);
      throw new Error(error);
    }
    this._settings.path = (0, import_obsidian.normalizePath)(settingsObj.path);
    this._settings.type = (_a = settingsObj.type) != null ? _a : "horizontal";
    this._settings.radius = (_b = settingsObj.radius) != null ? _b : 0;
    this._settings.gutter = (_c = settingsObj.gutter) != null ? _c : 8;
    this._settings.sortby = (_d = settingsObj.sortby) != null ? _d : "ctime";
    this._settings.sort = (_e = settingsObj.sort) != null ? _e : "desc";
    this._settings.mobile = (_f = settingsObj.mobile) != null ? _f : 1;
    if (import_obsidian.Platform.isDesktop)
      this._settings.columns = (_g = settingsObj.columns) != null ? _g : 3;
    else
      this._settings.columns = this._settings.mobile;
    this._settings.height = (_h = settingsObj.height) != null ? _h : 260;
  }
  _getImagesList() {
    const folder = this.app.vault.getAbstractFileByPath(this._settings.path);
    let files;
    if (folder instanceof import_obsidian.TFolder) {
      files = folder.children;
    } else {
      const error = "The folder doesn't exist, or it's empty!";
      this._renderError(error);
      throw new Error(error);
    }
    const validExtensions = ["jpeg", "jpg", "gif", "png", "webp", "tiff", "tif"];
    const images = files.filter((file) => {
      if (file instanceof import_obsidian.TFile && validExtensions.includes(file.extension))
        return file;
    });
    const orderedImages = images.sort((a, b) => {
      const refA = this._settings.sortby ? a.stat[this._settings.sortby] : a["name"].toUpperCase();
      const refB = this._settings.sortby ? b.stat[this._settings.sortby] : b["name"].toUpperCase();
      return refA < refB ? -1 : refA > refB ? 1 : 0;
    });
    const sortedImages = this._settings.sort === "asc" ? orderedImages : orderedImages.reverse();
    this._imagesList = sortedImages.map((file) => this.app.vault.adapter.getResourcePath(file.path));
  }
  _injectVerMasonry() {
    const gallery = this.container.createEl("div");
    gallery.addClass("grid-wrapper");
    gallery.style.lineHeight = "0px";
    gallery.style.columnCount = `${this._settings.columns}`;
    gallery.style.columnGap = `${this._settings.gutter}px`;
    this._gallery = gallery;
    this._imagesList.forEach((uri) => {
      const img = this._gallery.createEl("img");
      img.addClass("grid-item");
      img.style.marginBottom = `${this._settings.gutter}px`;
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.borderRadius = `${this._settings.radius}px`;
      img.src = uri;
    });
  }
  _injectHorMasonry() {
    const gallery = this.container.createEl("div");
    gallery.addClass("grid-wrapper");
    gallery.style.display = "flex";
    gallery.style.flexWrap = "wrap";
    gallery.style.marginRight = `-${this._settings.gutter}px`;
    this._gallery = gallery;
    this._imagesList.forEach((uri) => {
      const figure = this._gallery.createEl("figure");
      figure.addClass("grid-item");
      figure.style.margin = `0px ${this._settings.gutter}px ${this._settings.gutter}px 0px`;
      figure.style.height = `${this._settings.height}px`;
      figure.style.borderRadius = `${this._settings.radius}px`;
      figure.style.flex = "1 0 auto";
      figure.style.overflow = "hidden";
      const img = figure.createEl("img");
      img.style.objectFit = "cover";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.borderRadius = "0px";
      img.src = uri;
    });
  }
  _renderError(error) {
    const wrapper = this.container.createEl("div");
    const content = wrapper.createEl("p", { text: `(Error) Image Gallery: ${error}` });
    wrapper.style.borderRadius = "4px";
    wrapper.style.padding = "2px 16px";
    wrapper.style.backgroundColor = "#e50914";
    wrapper.style.color = "#fff";
    wrapper.style.fontWeight = "bolder";
  }
};

// src/main.ts
var ImgGallery = class extends import_obsidian2.Plugin {
  onload() {
    return __async(this, null, function* () {
      this.registerMarkdownCodeBlockProcessor("img-gallery", (src, el, ctx) => {
        const handler = new imgGalleryRenderer(this, src, el, this.app);
        ctx.addChild(handler);
      });
    });
  }
  onunload() {
  }
};
