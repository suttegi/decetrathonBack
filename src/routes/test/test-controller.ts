import { Request, Response } from 'express';
import TestService from './test-service';
import User from '../auth/models/User';

class CourseController {
  private testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      if ((req.files as { [fieldname: string]: Express.Multer.File[] })['material']){
        console.log("with material");
        
        const courseData = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const telegramId = req.body.telegramId;
        const userInput = req.body.userInput;
        const user_interest = req.body.user_interest;
    
        const courseFile = files['material'] ? files['material'][0] : null;
    
        if (!courseFile || !telegramId) {
          res.status(400).json({ message: 'Course file is required' });
          return;
        }
    
        const newCourse = await this.testService.createCourse(
          courseData,
          telegramId,
          user_interest,
          userInput,
          courseFile.buffer,
          courseFile.originalname
        );
        
        res.status(201).json(newCourse);
      }
      else{
        console.log("without material");
        const courseData = req.body;
        const telegramId = req.body.telegramId;
        const userInput = req.body.userInput;
        const user_interest = req.body.user_interest;
    
        if (!telegramId) {
          res.status(400).json({ message: 'Course file is required' });
          return;
        }
    
        const newCourse = await this.testService.createCourse(
          courseData,
          telegramId,
          userInput,
          user_interest,
          "",
          "" 
        );
        
        res.status(201).json(newCourse);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ message: 'Error creating course lol', error });
    }
  };
  getCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      console.log(`Fetching course with id: ${id}`);
      const course = await this.testService.getCourse(id);

      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (err) {
      console.error('Error getting course:', err);
      res.status(500).json({ message: 'Error getting course', error: err });
    }
  };

  getTopicId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: id } = req.params;
      console.log(`Fetching course with id: ${id}`);
      const course = await this.testService.getTopicId(id);

      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (err) {
      console.error('Error getting course:', err);
      res.status(500).json({ message: 'Error getting course', error: err });
    }
  };


  getTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.params);

      // const old = 'http://localhost:8080/api/course/id1/id2'
      // const new = 'http://localhost:8080/api/course/id={123}&id2={0123}'

      const { id: id_of_course, internalId: id_of_topic } = req.params;
      console.log(`Fetching course with id: ${id_of_course}`);
      const course = await this.testService.getTopic(id_of_course, id_of_topic);

      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (err) {
      console.error('Error getting course:', err);
      res.status(500).json({ message: 'Error getting course', error: err });
    }
  };


  userCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const { telegramId } = req.body;
  
      const courses = await this.testService.userCourses(telegramId);
  
      if (courses) {
        res.status(200).json({ courses });
      } else {
        res.status(404).json({ message: 'No courses found for the user' });
      }
    } catch (err) {
      console.error('Error getting user courses:', err);
      res.status(500).json({ message: 'Error getting user courses', error: err });
    }
  };

  completeTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.params);

      const { id: id_of_course, internalId: id_of_topic } = req.params;
      console.log(`Fetching course with id: ${id_of_course}`);
      
      // Завершение темы
      const course = await this.testService.completeTopic(id_of_course, id_of_topic);

      if (course) {
        // После успешного завершения темы, добавляем "голду" пользователю
        const { telegramId } = req.body; // Предположим, что telegramId передаётся в теле запроса
        const goldAmount = 100; // Пример значения для добавления "голды", можно заменить на свою логику

        // Вызов метода addGold из AuthService
        const result = await this.testService.addGold(telegramId, goldAmount);

        // Возвращаем ответ с информацией о курсе и обновлённым количеством "голды"
        res.status(200).json({
          message: 'Topic completed successfully, gold added',
          course,
          gold: result.newGoldAmount // Новое количество "голды" пользователя
        });
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (err) {
      console.error('Error getting course:', err);
      res.status(500).json({ message: 'Error getting course', error: err });
    }
  };


  getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Fetching all courses');
      const courses = await this.testService.getAllCourses();
      res.status(200).json(courses);
    } catch (err) {
      console.error('Error getting courses:', err);
      res.status(500).json({ message: 'Error getting courses', error: err });
    }
  };

  // updateCourse = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { id } = req.params;
  //     const courseUpdate = req.body;
  //     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  //     const courseFile = files['material'] ? files['material'][0] : null;

  //     console.log('Received course update data:', courseUpdate);
  //     console.log('Received course file:', courseFile);

  //     const updatedCourse = await this.testService.updateCourse(
  //       id,
  //       courseUpdate,
  //       courseFile ? courseFile.buffer : undefined,
  //       courseFile ? courseFile.originalname : undefined
  //     );

  //     if (updatedCourse) {
  //       res.status(200).json(updatedCourse);
  //     } else {
  //       res.status(404).json({ message: 'Course not found' });
  //     }
  //   } catch (error) {
  //     console.error('Error updating course:', error);
  //     res.status(500).json({ message: 'Error updating course', error });
  //   }
  // };

  deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const course = await this.testService.deleteCourse(id);

      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      res.status(500).json({ message: 'Error deleting course', error: err });
    }
  };
}

export default CourseController;
