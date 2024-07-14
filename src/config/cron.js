import cron from 'node-cron';
import { checkPenalty } from "../app/utils/jobs.js";

const daily = '0 0 * * *';
const everyMinute = '* * * * *';
const everyFiveMinutes = '*/5 * * * *';

const dailyTask = async () => {
   console.log('Running a task daily at midnight');

   // Add your task here
   await checkPenalty();
}

const start = () => {
   cron.schedule(daily, dailyTask);
}

export default {
   start
};