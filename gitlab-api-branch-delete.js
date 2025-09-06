//const { Gitlab } = require('@gitbeaker/node');
//const { gitlabConnect} = require("./config");
import { Gitlab } from '@gitbeaker/node';
import { gitlabConnect } from './config.js';

// Создаем клиент GitLab
const api = new Gitlab(gitlabConnect);

// ID или путь до вашего проекта
//const projectId = 'perspect/filer/devops/scripts'; // id или путь до проекта
const projectId = process.argv[2]; // id или путь до проекта
const search = "^releases"

async function checkAndDeleteBranches() {
    try {
        // Получение списка веток
        const branches = await api.Branches.all(projectId, {
            search: search
        } );

        console.log('Список веток:', branches);

        // Сортировка по дате и отсечение последних двух
        const sortedBranches = branches.sort((a, b) => {
            return new Date(b.commit.created_at) - new Date(a.commit.created_at);
        })

        console.log('Список отсортировнных веток:', sortedBranches)

        // Оставляем только две самые последние ветки релизов
        const topTwo = sortedBranches.slice(0, 2);
        console.log('Список отсортировнных веток, топ 2:', topTwo)
        console.log('Список отсортировнных веток, топ 2, имена:', topTwo[0].name, topTwo[1].name)

        // Удаление ветки
       branches.forEach(branch => {
            if(branch.name !== topTwo[0].name && branch.name !== topTwo[1].name) {
                deleteBranch(branch.name)
                //console.log('Ветка удалена:', branch.name)
            }
        } )

    } catch (error) {
        console.error('Ошибка при управлении ветками:', error);
    }
}

checkAndDeleteBranches();

async function deleteBranch(branchName) {
    try {
        await api.Branches.remove(projectId, branchName);
        console.log('Ветка удалена:', branchName);
    }
    catch (error) {
        console.error('Ошибка при удалении ветки:', error);
    }

}