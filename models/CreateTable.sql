
-- ---------------------------------------------------------------------------------------------


CREATE TABLE `department` (
  `dept_id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(45) NOT NULL,
  PRIMARY KEY (`dept_id`)
)ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `faculty` (
  `faculty_id` int NOT NULL AUTO_INCREMENT,
  `faculty_name` varchar(45) NOT NULL,
  `dept_id` int NOT NULL,
  `faculty_email` varchar(45) NOT NULL,
  `faculty_password` varchar(200) NOT NULL,
  `admin` tinyint DEFAULT '0',
  PRIMARY KEY (`faculty_id`),
  KEY `dept_faculty_idx` (`dept_id`),
  CONSTRAINT `dept_faculty` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `student` (
  `university_reg_no` varchar(45) NOT NULL,
  `stud_name` varchar(45) DEFAULT NULL,
  `stud_dept_id` int DEFAULT NULL,
  `passout_year` int NOT NULL,
  PRIMARY KEY (`university_reg_no`),
  KEY `student_dept_id_idx` (`stud_dept_id`),
  CONSTRAINT `student_dept_id` FOREIGN KEY (`stud_dept_id`) REFERENCES `department` (`dept_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `course` (
  `course_code` varchar(45) NOT NULL,
  `course_name` varchar(60) DEFAULT NULL,
  `no_of_cos` int DEFAULT NULL,
  `semester` int DEFAULT NULL,
  PRIMARY KEY (`course_code`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `course_faculty` (
  `course_code` varchar(45) NOT NULL,
  `course_year` int  NOT NULL,
  `faculty_id` int  NOT NULL,
  `passout_year` int,
  CONSTRAINT `c_code` FOREIGN KEY (`course_code`) REFERENCES `course` (`course_code`),
  CONSTRAINT `course_faculty_id` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `co_po_mapping` (
  `course_code` varchar(45) NOT NULL,
  `co` int NOT NULL,
  `po` int NOT NULL,
  `relation` int DEFAULT NULL,
  PRIMARY KEY (`course_code`,`co`,`po`),
  CONSTRAINT `code` FOREIGN KEY (`course_code`) REFERENCES `course` (`course_code`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


SELECT `course`.`course_code`,
    `course`.`course_name`,
    `course`.`no_of_cos`,
    `course`.`semester`,
    `course`.`dept_id`
FROM `asd_lab`.`course`;

CREATE TABLE `student_enrollment` (
  `university_reg_no` varchar(10) NOT NULL,
  `course_code` varchar(10) NOT NULL,
  `year` int NOT NULL,
  `batch` int DEFAULT NULL,
  `series_1_marks` int DEFAULT NULL,
  `series_2_marks` int DEFAULT NULL,
  `assignment_1_marks` int DEFAULT NULL,
  `assignment_2_marks` int DEFAULT NULL,
  `end_sem_exam_marks` int DEFAULT NULL,
  PRIMARY KEY (`university_reg_no`,`course_code`,`year`),
  KEY `fk_student_enrollement_2_idx` (`course_code`,`year`),
  CONSTRAINT `fk_student_enrollement_1` FOREIGN KEY (`university_reg_no`) REFERENCES `student` (`university_reg_no`),
  CONSTRAINT `fk_student_enrollement_2` FOREIGN KEY (`course_code`, `year`) REFERENCES `course_faculty` (`course_code`, `course_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `internal_exam_marks` (
  `course_code` varchar(10) NOT NULL,
  `year` int NOT NULL,
  `university_reg_no` varchar(10) NOT NULL,
  `exam_no` int NOT NULL,
  `co1` int DEFAULT NULL,
  `co2` int DEFAULT NULL,
  `co3` int DEFAULT NULL,
  `co4` int DEFAULT NULL,
  `co5` int DEFAULT NULL,
  `co6` int DEFAULT NULL,
  PRIMARY KEY (`course_code`,`year`,`university_reg_no`,`exam_no`),
  KEY `fk_internal_exam_marks_2_idx` (`university_reg_no`),
  CONSTRAINT `fk_internal_exam_marks_1` FOREIGN KEY (`course_code`, `year`) REFERENCES `course_faculty` (`course_code`, `course_year`),
  CONSTRAINT `fk_internal_exam_marks_2` FOREIGN KEY (`university_reg_no`) REFERENCES `student` (`university_reg_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



