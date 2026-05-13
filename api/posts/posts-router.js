// posts için gerekli routerları buraya yazın
const express = require("express");
const { find, findById, insert, update, remove, findPostComments } = require("./posts-model");

const router = express.Router();

/**
 * GET / - Tüm gönderileri getir
 */
router.get("/", async (req, res) => {
    try {
        const posts = await find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({
            message: "Gönderiler alınamadı"
        });
    }
});


router.get("/:id/comments", async (req, res) => {
    try {
        const id = req.params.id;
        const post = await findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                message: "Girilen ID'li gönderi bulunamadı." 
            });
        }
        
        const comments = await findPostComments(id);
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ 
            message: "Yorumlar bilgisi getirilemedi" 
        });
    }
});

/**
 * GET /:id - Belirli bir gönderiyi getir
 */
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const post = await findById(id);
        
        if (!post) {
            return res.status(404).json({
                message: "Belirtilen ID'li gönderi bulunamadı"
            });
        }
        
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({
            message: "Gönderi bilgisi alınamadı"
        });
    }
});

/**
 * POST / - Yeni gönderi oluştur
 */
router.post("/", async (req, res) => {
    try {
        const { title, contents } = req.body;
        
        if (!title || !contents) {
            return res.status(400).json({ 
                message: "Lütfen gönderi için bir title ve contents sağlayın" 
            });
        }
        
        const post_id = await insert(req.body);
        res.status(201).json({ 
            id: post_id, 
            ...req.body 
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Veritabanına kaydedilirken bir hata oluştu" 
        });
    }
});

/**
 * PUT /:id - Gönderiyi güncelle
 */
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, contents } = req.body;
        
        const post = await findById(id);
        if (!post) {
            return res.status(404).json({ 
                message: "Belirtilen ID'li gönderi bulunamadı" 
            });
        }
        
        if (!title || !contents) {
            return res.status(400).json({ 
                message: "Lütfen gönderi için title ve contents sağlayın" 
            });
        }
        
        await update(id, req.body);
        const updatedPost = await findById(id);
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ 
            message: "Gönderi bilgileri güncellenemedi" 
        });
    }
});

/**
 * DELETE /:id - Gönderiyi sil
 */
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const post = await findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                message: "Belirtilen ID'li gönderi bulunamadı" 
            });
        }
        
        await remove(id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ 
            message: "Gönderi silinemedi" 
        });
    }
});

module.exports = router;