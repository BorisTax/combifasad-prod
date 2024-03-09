import messages from '../messages.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/other.js';
import { templateServiceProvider } from '../options.js';
import { isClientAtLeast, isEditorAtLeast } from '../functions/user.js';
import { TemplateService } from '../services/templateService.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
export default router;
router.get("/", async (req, res) => {
    if (!isClientAtLeast(req.userRole))
        return accessDenied(res);
    const result = await getTemplates(req.query.table);
    if (!result.success)
        return res.json(result);
    res.status(result.status).json(result);
});
router.delete("/", async (req, res) => {
    if (!isEditorAtLeast(req.userRole))
        return accessDenied(res);
    const { name, table } = req.body;
    let result;
    result = await deleteTemplate(table, name);
    const status = result.success ? 200 : 404;
    res.status(status).json(result);
});
router.post("/", async (req, res) => {
    if (!isEditorAtLeast(req.userRole))
        return accessDenied(res);
    const { name, data, table } = req.body;
    const result = await addTemplate(table, { name, data });
    const status = result.success ? 201 : 409;
    res.status(status).json(result);
});
router.put("/", async (req, res) => {
    if (!isEditorAtLeast(req.userRole))
        return accessDenied(res);
    const { name, newName, data, table } = req.body;
    const result = await updateTemplate(table, { name, newName, data });
    res.status(result.status).json(result);
});
export async function getTemplates(table) {
    const templateService = new TemplateService(templateServiceProvider);
    return await templateService.getTemplates(table);
}
export async function addTemplate(table, { name, data }) {
    const templateService = new TemplateService(templateServiceProvider);
    const result = await templateService.getTemplates(table);
    if (!result.success)
        return result;
    const templates = result.data;
    if (templates.find(m => m.name === name))
        return { success: false, status: 409, message: messages.TEMPLATE_EXIST };
    return await templateService.addTemplate(table, { name, data });
}
export async function updateTemplate(table, { name, newName, data }) {
    const templateService = new TemplateService(templateServiceProvider);
    const result = await templateService.getTemplates(table);
    if (!result.success)
        return result;
    const templates = result.data;
    if (!templates.find(m => m.name === name))
        return { success: false, status: 404, message: messages.TEMPLATE_NO_EXIST };
    return await templateService.updateTemplate(table, { name, newName, data });
}
export async function deleteTemplate(table, name) {
    const templateService = new TemplateService(templateServiceProvider);
    const result = await templateService.getTemplates(table);
    if (!result.success)
        return result;
    const templates = result.data;
    if (!templates.find(m => m.name === name))
        return { success: false, status: 404, message: messages.TEMPLATE_NO_EXIST };
    return await templateService.deleteTemplate(table, name);
}
