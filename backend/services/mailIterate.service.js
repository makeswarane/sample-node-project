module.exports.iterate = (obj, template) => {
    Object.entries(obj).forEach(([key, value]) => {
        template = template.replace(`{{${key}}}`, value);
    });
    return template;
}