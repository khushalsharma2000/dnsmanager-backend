// routes/dnsRoutes.js

import express from "express";
import {
  listHostedZones,
  createDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
} from "../Controllers/dnsController.js"


const router = express.Router();

router.get("/hostedZones/:hostedZoneId", listHostedZones);
router.post("/dns/create", createDNSRecord);
router.put("/dns/update", updateDNSRecord);
router.delete("/dns/delete", deleteDNSRecord);

export default router;
