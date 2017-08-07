/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table hackernews.items
DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int(10) unsigned NOT NULL COMMENT 'The item''s unique id.',
  `deleted` tinyint(1) unsigned DEFAULT NULL COMMENT 'true if the item is deleted.',
  `type_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The type of item. One of "job", "story", "comment", "poll", or "pollopt".',
  `by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'The username of the item''s author.',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation date of the item, in Unix Time.',
  `text` text COLLATE utf8mb4_unicode_ci COMMENT 'The comment, story or poll text. HTML.',
  `dead` tinyint(1) DEFAULT NULL COMMENT 'true if the item is dead.',
  `url` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'The URL of the story.',
  `score` int(11) DEFAULT NULL COMMENT 'The story''s score, or the votes for a pollopt.',
  `title` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'The title of the story, poll or job.',
  `descendants` int(10) unsigned DEFAULT NULL COMMENT 'In the case of stories or polls, the total comment count.',
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table hackernews.item_relation
DROP TABLE IF EXISTS `item_relation`;
CREATE TABLE IF NOT EXISTS `item_relation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(10) unsigned NOT NULL,
  `child_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table hackernews.item_type
DROP TABLE IF EXISTS `item_type`;
CREATE TABLE IF NOT EXISTS `item_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table hackernews.item_type: ~4 rows (approximately)
/*!40000 ALTER TABLE `item_type` DISABLE KEYS */;
INSERT INTO `item_type` (`id`, `name`) VALUES
	(1, 'job'),
	(2, 'story'),
	(3, 'comment'),
	(4, 'poll'),
	(5, 'pollopt');
/*!40000 ALTER TABLE `item_type` ENABLE KEYS */;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
