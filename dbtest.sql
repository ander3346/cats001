/*
 Navicat MySQL Dump SQL

 Source Server         : aaa
 Source Server Type    : MySQL
 Source Server Version : 80046 (8.0.46)
 Source Host           : localhost:3306
 Source Schema         : test

 Target Server Type    : MySQL
 Target Server Version : 80046 (8.0.46)
 File Encoding         : 65001

 Date: 25/06/2026 09:57:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admininfo
-- ----------------------------
DROP TABLE IF EXISTS `admininfo`;
CREATE TABLE `admininfo`  (
  `uid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pwd` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `headpic` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `regdate` date NULL DEFAULT NULL,
  `regtime` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `regip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `role` int NULL DEFAULT 1,
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admininfo
-- ----------------------------
INSERT INTO `admininfo` VALUES (1, 'admin', '42e01011485d54215a236fc6e0d6486323c56fdd34c76324fcd3a46c8448fcbc', '../images/1781637038118-588990216h3.webp', '2026-06-16', '11:23:33', '127.0.0.1', 1, '11.qq.com', '13899996666');

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `newsid` int NOT NULL AUTO_INCREMENT,
  `newstitle` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `newscontent` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `newsimg1` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `newsimg2` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `newsvideo1` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `newsdate` date NULL DEFAULT NULL,
  `newstime` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `newsauthor` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `state` int NULL DEFAULT 0,
  PRIMARY KEY (`newsid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (1, '2026 高考试题全解析：今年全国卷释放了哪些新变化？', '随着最后一门考试结束，1290 万考生正式走出 2026 年高考考场。与此同时，志愿填报、毕业旅行、手机电脑换新、AI 志愿咨询等「后高考」需求也开始快速升温。', NULL, NULL, NULL, '2026-06-06', '9:32:22', 'qxf', 1);
INSERT INTO `news` VALUES (2, '为什么中国学生多的英国大学，反而会更好？', '为什么中国学生多的英国大学，反而会更好？', NULL, NULL, NULL, '2026-06-06', '9:32:22', '111', 1);
INSERT INTO `news` VALUES (3, '2026年高考语文考试结束，作文题目新鲜出炉2026 高考试题全解析：今年全国卷释放了哪些新变化？2026 高考试题全解析：今年全国卷释放了哪些新变化？2026 高考试题全解析：今年全国卷释放了哪些新变化？2026 高考试题全解析：今年全国卷释放了哪些新变化？2026 高考试题全解析：今年全国卷释放了哪些新变化？', '2026年高考语文考试结束，作文题目新鲜出炉', NULL, NULL, NULL, '2026-06-06', '9:32:22', '22', 1);
INSERT INTO `news` VALUES (4, '2026年高考语文考试结束，作文题目新鲜出炉2026 高考试题全解析：今年全国卷释放了哪些新变化？', '2026年高考语文考试结束，作文题目新鲜出炉', NULL, NULL, NULL, '2026-06-06', '9:32:22', 'qxf', 1);
INSERT INTO `news` VALUES (5, '2026年高考语文考试结束，作文题目新鲜出炉', '2026年高考语文考试结束，作文题目新鲜出炉', NULL, NULL, NULL, '2026-06-06', '9:32:22', 'qxf', 1);
INSERT INTO `news` VALUES (6, '2026年高考语文考试结束，作文题目新鲜出炉2026 高考试题全解析：今年全国卷释放了哪些新变化？', '2026年高考语文考试结束，作文题目新鲜出炉', NULL, NULL, NULL, '2026-06-06', '9:32:22', '111', 1);
INSERT INTO `news` VALUES (7, '2026年高考语文考试结束，作文题目新鲜出炉2026 高考试题全解析：今年全国卷释放了哪些新变化？2026 高考试题全解析：今年全国卷释放了哪些新变化？', '2026年高考语文考试结束，作文题目新鲜出炉', NULL, NULL, NULL, '2026-06-06', '9:32:22', '11', 1);
INSERT INTO `news` VALUES (8, '2026年高考语文考试结束，作文题目新鲜出炉', '2026年高考语文考试结束，作文题目新鲜出炉', NULL, NULL, NULL, '2026-06-06', '9:32:22', '11', 1);
INSERT INTO `news` VALUES (9, '2026年高考语文考试结束，作文题目新鲜出炉', '2026年高考语文考试结束，作文题目新鲜出炉', NULL, NULL, NULL, '2026-06-06', '9:32:22', '11', 0);
INSERT INTO `news` VALUES (10, '2026年高考语文考试结束，作文题目新鲜出炉', '2026年高考语文考试结束，作文题目新鲜出炉', NULL, NULL, NULL, '2026-06-06', '9:32:22', '222', 0);
INSERT INTO `news` VALUES (11, '2026年高考语文考试结束，作文题目新鲜出炉', '2026年高考语文考试结束，作文题目新鲜出炉', NULL, NULL, NULL, '2026-06-06', '9:32:22', '222', 0);

-- ----------------------------
-- Table structure for slidepic
-- ----------------------------
DROP TABLE IF EXISTS `slidepic`;
CREATE TABLE `slidepic`  (
  `picID` int NOT NULL AUTO_INCREMENT,
  `picname` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `picdescription` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `state` int NULL DEFAULT 0,
  PRIMARY KEY (`picID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of slidepic
-- ----------------------------
INSERT INTO `slidepic` VALUES (1, 'images/index/banner_1.png', '中国山水1', 0);
INSERT INTO `slidepic` VALUES (2, 'images/index/banner_2.png', '中国山水2', 0);
INSERT INTO `slidepic` VALUES (3, 'images/index/banner_1.png', '中国山水3', 0);
INSERT INTO `slidepic` VALUES (4, 'images/index/banner_2.png', '中国山水4', 0);
INSERT INTO `slidepic` VALUES (5, 'images/index/banner_2.png', '中国山水5', 0);
INSERT INTO `slidepic` VALUES (6, 'images/index/banner_1.png', '中国山水6', 0);
INSERT INTO `slidepic` VALUES (7, 'images/index/f1.jpg', '中国山水7', 1);
INSERT INTO `slidepic` VALUES (8, 'images/index/s1.jpg', '中国山水8', 1);
INSERT INTO `slidepic` VALUES (9, 'images/index/s3.jpg', '中国山水9', 1);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `uid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pwd` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `state` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `headpic` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `regdate` date NULL DEFAULT NULL,
  `regtime` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `regIP` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `role` int NULL DEFAULT 1,
  `phone` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  UNIQUE INDEX `uid_UNIQUE`(`uid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (18, 'a', '1', '1', 'img/blood.png', '3175457064@qq.com', '2026-06-23', '08:26:21', NULL, 1, NULL);
INSERT INTO `user` VALUES (19, 'w', '1', '1', 'img/ChatGPT.png', '3175457064@qq.com', '2026-06-25', '09:47:17', NULL, 1, NULL);

SET FOREIGN_KEY_CHECKS = 1;
