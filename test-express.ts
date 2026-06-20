import express from "express";
import multer from "multer";
import pdfParseModule from "pdf-parse";

const pdfParse = typeof pdfParseModule === "function" ? pdfParseModule : (pdfParseModule as any).default || pdfParseModule;

console.log("Type of pdfParse:", typeof pdfParse);
