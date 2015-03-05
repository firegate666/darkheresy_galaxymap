CREATE TABLE IF NOT EXISTS `planet` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `createdate` bigint(20) NOT NULL,
  `changedate` bigint(20) NOT NULL,
  `x` bigint(20) NOT NULL,
  `y` bigint(20) NOT NULL,
  `x2` bigint(20) NOT NULL,
  `y2` bigint(20) NOT NULL,
  `name` text NOT NULL,
  `type` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=0 ;
