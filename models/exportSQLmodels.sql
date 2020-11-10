CREATE TABLE `assignment` (
  `assign_course_code` varchar(45) NOT NULL,
  `assign_course_year` int NOT NULL,
  `assign_no` int NOT NULL,
  `co1_total` int DEFAULT NULL,
  `co2_total` int DEFAULT NULL,
  `co3_total` int DEFAULT NULL,
  `co4_total` int DEFAULT NULL,
  `co5_total` int DEFAULT NULL,
  `co6_total` int DEFAULT NULL,
  `co1_attainment` float DEFAULT NULL,
  `co2_attainment` float DEFAULT NULL,
  `co3_attainment` float DEFAULT NULL,
  `co4_attainment` float DEFAULT NULL,
  `co5_attainment` float DEFAULT NULL,
  `co6_attainment` float DEFAULT NULL,
  PRIMARY KEY (`assign_course_code`,`assign_course_year`,`assign_no`),
  CONSTRAINT `assign_course_code` FOREIGN KEY (`assign_course_code`) REFERENCES `course` (`course_code`),
  CONSTRAINT `assign_course_year` FOREIGN KEY (`assign_course_code`, `assign_course_year`) REFERENCES `co_attainment` (`course_code`, `year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `co_attainment` (
  `course_code` varchar(45) NOT NULL,
  `year` int NOT NULL,
  `co1` float DEFAULT NULL,
  `co2` float DEFAULT NULL,
  `co3` float DEFAULT NULL,
  `co4` float DEFAULT NULL,
  `co5` float DEFAULT NULL,
  `co6` float DEFAULT NULL,
  PRIMARY KEY (`course_code`,`year`),
  CONSTRAINT `course_co_attainment` FOREIGN KEY (`course_code`) REFERENCES `course` (`course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `co_po_mapping` (
  `code` varchar(45) NOT NULL,
  `co` int NOT NULL,
  `po` int NOT NULL,
  `relation` int DEFAULT NULL,
  PRIMARY KEY (`code`,`co`,`po`),
  CONSTRAINT `code` FOREIGN KEY (`code`) REFERENCES `course` (`course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `course` (
  `course_code` varchar(45) NOT NULL,
  `course_name` varchar(60) DEFAULT NULL,
  `co_no` int DEFAULT NULL,
  `dept_id` int DEFAULT NULL,
  `semester` int DEFAULT NULL,
  PRIMARY KEY (`course_code`),
  KEY `course_dept_id_idx` (`dept_id`),
  CONSTRAINT `course_dept_id` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `course_faculty` (
  `c_code` varchar(45) NOT NULL,
  `course_year` int DEFAULT NULL,
  `course_faculty_id` int DEFAULT NULL,
  PRIMARY KEY (`c_code`),
  KEY `course_faculty_id_idx` (`course_faculty_id`),
  KEY `course_year_idx` (`c_code`,`course_year`),
  CONSTRAINT `c_code` FOREIGN KEY (`c_code`) REFERENCES `course` (`course_code`),
  CONSTRAINT `course_faculty_id` FOREIGN KEY (`course_faculty_id`) REFERENCES `faculty` (`faculty_id`),
  CONSTRAINT `course_year` FOREIGN KEY (`c_code`, `course_year`) REFERENCES `co_attainment` (`course_code`, `year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `end_sem_exam` (
  `course_code` varchar(45) NOT NULL,
  `course_year` int NOT NULL,
  `co_attained` float DEFAULT NULL,
  PRIMARY KEY (`course_code`,`course_year`),
  CONSTRAINT `ese_course` FOREIGN KEY (`course_code`, `course_year`) REFERENCES `co_attainment` (`course_code`, `year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `internal_exam` (
  `internal_course_code` varchar(45) NOT NULL,
  `internal_course_year` int NOT NULL,
  `internal_exam_no` int NOT NULL,
  `co1_attainment` float DEFAULT NULL,
  `co2_attainment` float DEFAULT NULL,
  `co3_attainment` float DEFAULT NULL,
  `co4_attainment` float DEFAULT NULL,
  `co5_attainment` float DEFAULT NULL,
  `co6_attainment` float DEFAULT NULL,
  `co1_total` int DEFAULT NULL,
  `co2_total` int DEFAULT NULL,
  `co3_total` int DEFAULT NULL,
  `co4_total` int DEFAULT NULL,
  `co5_total` int DEFAULT NULL,
  `co6_total` int DEFAULT NULL,
  PRIMARY KEY (`internal_course_code`,`internal_course_year`,`internal_exam_no`),
  CONSTRAINT `internal_course_code` FOREIGN KEY (`internal_course_code`) REFERENCES `course` (`course_code`),
  CONSTRAINT `internal_course_year` FOREIGN KEY (`internal_course_code`, `internal_course_year`) REFERENCES `co_attainment` (`course_code`, `year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `student` (
  `university_reg_no` varchar(45) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `stud_dept_id` int DEFAULT NULL,
  PRIMARY KEY (`university_reg_no`),
  KEY `student_dept_id_idx` (`stud_dept_id`),
  CONSTRAINT `student_dept_id` FOREIGN KEY (`stud_dept_id`) REFERENCES `department` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `faculty` (
  `faculty_id` int NOT NULL AUTO_INCREMENT,
  `faculty_name` varchar(45) NOT NULL,
  `dept_id` int NOT NULL,
  `faculty_email` varchar(45) NOT NULL,
  `faculty_password` varchar(200) NOT NULL,
  `admin` tinyint NOT NULL,
  PRIMARY KEY (`faculty_id`),
  KEY `dept_faculty_idx` (`dept_id`),
  CONSTRAINT `dept_faculty` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `department` (
  `dept_id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(45) NOT NULL,
  `hod_fac_id` int DEFAULT NULL,
  PRIMARY KEY (`dept_id`),
  KEY `hod_idx` (`hod_fac_id`),
  CONSTRAINT `hod` FOREIGN KEY (`hod_fac_id`) REFERENCES `faculty` (`faculty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
