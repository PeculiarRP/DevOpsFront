import { Registry, Counter } from 'prom-client';

// Создаем реестр метрик
import express from "express";

const registry = new Registry();
const metrics = {
    pageViews: new Counter({
        name: 'react_page_views_total',
        help: 'Total page views',
        registers: [registry]
    })
};

// Запускаем мини-сервер для Prometheus (только в dev-режиме)
if (import.meta.env.DEV) {
    const app = express();
    const port = 9091;

    app.get('/metrics', async (req, res) => {
        res.set('Content-Type', registry.contentType);
        res.end(await registry.metrics());
    });

    app.listen(port, () => {
        console.log(`Prometheus metrics at http://localhost:${port}/metrics`);
    });
}

export { metrics };