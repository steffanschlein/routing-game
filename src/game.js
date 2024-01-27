import { Container, Graphics, Sprite, Text } from "pixi.js";
import { GameLogic } from "./game_logic";
import { Board } from "./board";
import { easyProblems, extremlyHardProblems, hardProblems, mediumProblems, veryEasyProblems, veryHardProblems } from "./problems";
import { decodeBoardConfiguration } from "./serialization";
import { createButton } from "./ui_components";
import { List } from "@pixi/ui";

export class Game {
    gameContainer;
    constructor(app, mainMenu) {
        this.app = app

        this.gameContainer = new Container();

        this.basicText = new Text();
        this.gameContainer.addChild(this.basicText);

        this.difficultyText = new Text();
        this.gameContainer.addChild(this.difficultyText)

        this.mainMenuButton = createButton("Hauptmenu")
        this.mainMenuButton.onPress.connect(() => mainMenu())
        this.gameContainer.addChild(this.mainMenuButton)

        const gameLogic = new GameLogic(this.updateUsedRodInfo())
        this.board = new Board(gameLogic)

        this.resetBoardButton = createButton("Zurücksetzen")
        this.resetBoardButton.onPress.connect(() => gameLogic.onClickResetRods(this.board))
        this.gameContainer.addChild(this.resetBoardButton)

        this.gameContainer.addChild(this.board.boardContainer);

        this.helpButton = createButton("Anleitung")
        this.helpButton.onPress.connect(() => this.helpContainer.visible = true)
        this.gameContainer.addChild(this.helpButton)

        this.helpContainer = this.createHelpContainer(app)

        this.gameContainer.addChild(this.helpContainer)

        this.updateUsedRodInfo()();
        this.calculateLayout();
    }
    
    start(difficulty, customGameHash) {
        let encodedProblem
        switch (difficulty) {
            case 'very_easy':
                encodedProblem = veryEasyProblems.random()
                this.updateDifficultyText("Sehr leicht")
                break;
            case 'easy':
                encodedProblem = easyProblems.random()
                this.updateDifficultyText("Leicht")
                break;
            case 'medium':
                encodedProblem = mediumProblems.random()
                this.updateDifficultyText("Mittel")
                break;
            case 'hard':
                encodedProblem = hardProblems.random()
                this.updateDifficultyText("Schwer")
                break;
            case 'very_hard':
                encodedProblem = veryHardProblems.random()
                this.updateDifficultyText("Sehr schwer")
                break;
            case 'extremly_hard':
                encodedProblem = extremlyHardProblems.random()
                this.updateDifficultyText("Extrem schwer")
                break;
            case 'custom':
                encodedProblem = customGameHash
                this.updateDifficultyText("Eigenes")
        }
        this.board.configuration = decodeBoardConfiguration(encodedProblem)
        this.updateUsedRodInfo()()
        this.helpContainer.visible = false
    }

    updateDifficultyText(level) {
        this.difficultyText.text = 'Stufe: ' + level
    }

    updateUsedRodInfo() {
        const game = this
        return () => {
            game.basicText.text = 'Benutzte Stäbe: ' + game.board.countSelectedRods() + ' / ' + game.board.allowedRods;
        }
    }
    
    adjustBoardContainer() {
        const VERTICAL_MARGIN = 80
        const smallerSideLength = Math.min(this.app.screen.width, this.app.screen.height - VERTICAL_MARGIN)
        const margin = Math.min(80, smallerSideLength * 0.05)
        const containerSize = smallerSideLength - 2 * margin
        this.board.boardContainer.width = containerSize
        this.board.boardContainer.height = containerSize
    
        this.board.boardContainer.x = this.app.screen.width / 2 - containerSize / 2;
        this.board.boardContainer.y = this.app.screen.height / 2 - containerSize / 2;
    }

    calculateLayout() {
        this.adjustBoardContainer()
        this.basicText.x = 50;
        this.basicText.y = 20;
        this.difficultyText.anchor.set(1, 0)
        this.difficultyText.x = this.app.screen.width - 50
        this.difficultyText.y = 20
        this.mainMenuButton.anchor.set(0, 1)
        this.mainMenuButton.x = this.board.boardContainer.x;
        this.mainMenuButton.y = this.app.screen.height - 20;
        this.resetBoardButton.anchor.set(0.5, 1)
        this.resetBoardButton.x = this.board.boardContainer.x + this.board.boardContainer.width / 2;
        this.resetBoardButton.y = this.app.screen.height - 20;
        this.helpButton.anchor.set(1, 1)
        this.helpButton.x = this.board.boardContainer.x + this.board.boardContainer.width;
        this.helpButton.y = this.app.screen.height - 20;
    }

    createHelpContainer(app) {
        const helpContainer = new Container();
        helpContainer.visible = false

        const helpContainerList = new List({
            elementsMargin: 10,
            vertPadding: 20,
            type: "vertical"
        })

        const helpContainerTitle = new Text("Anleitung")

        const helpText = new Text("Beim Routing-Spiel geht es darum, die roten Punkte mit möglichst wenig Stäbchen zu verbinden. Dabei muss man über die gelegten Stäbchen von jedem roten Punkt zu jedem anderen kommen können.\n\nEine Lösung zu finden ist nicht schwierig. Die Herausforderung besteht darin, möglichst wenige Stäbchen zu verwenden.", {
            fontSize: 20,
            wordWrap: true,
            wordWrapWidth: 500
        })
        
        const examplesContainer = new Container()
        const ex1 = Sprite.from('assets/valid_8_rods.png')
        ex1.x = 0
        ex1.width = 200
        ex1.height = 200
        ex1.calculateBounds()
        const ex1Text = new Text("Erlaubte Lösung,\nbenutzt 8 Stäbe", {
            fontSize: 24
        })
        ex1Text.x = 10
        ex1Text.y = 220
        const ex2 = Sprite.from('assets/invalid.png')
        ex2.x = 220
        ex2.width = 200
        ex2.height = 200
        ex2.calculateBounds()
        const ex2Text = new Text("Keine Lösung,\nnicht alles\nverbunden", {
            fontSize: 24
        })
        ex2Text.x = 230
        ex2Text.y = 220
        const ex3 = Sprite.from('assets/valid_6_rods.png')
        ex3.x = 440
        ex3.width = 200
        ex3.height = 200
        ex3.calculateBounds()
        const ex3Text = new Text("Erlaubte Lösung,\nbenutzt 6 Stäbe", {
            fontSize: 24
        })
        ex3Text.x = 450
        ex3Text.y = 220
        const ex4 = Sprite.from('assets/valid_4_rods_optimal.png')
        ex4.x = 660
        ex4.width = 200
        ex4.height = 200
        ex4.calculateBounds()
        const ex4Text = new Text("Optimale Lösung,\nbenutzt 4 Stäbe", {
            fontSize: 24
        })
        ex4Text.x = 670
        ex4Text.y = 220
        examplesContainer.addChild(ex1)
        examplesContainer.addChild(ex1Text)
        examplesContainer.addChild(ex2)
        examplesContainer.addChild(ex2Text)
        examplesContainer.addChild(ex3)
        examplesContainer.addChild(ex3Text)
        examplesContainer.addChild(ex4)
        examplesContainer.addChild(ex4Text)
        
        const ratio = examplesContainer.width / examplesContainer.height
        examplesContainer.width = 500
        examplesContainer.height = 500 / ratio
        
        const helpContainerCloseButton = createButton("Schließen")
        helpContainerCloseButton.onPress.connect(() => helpContainer.visible = false)

        helpContainerList.addChild(helpContainerTitle)
        helpContainerList.addChild(helpText)
        helpContainerList.addChild(examplesContainer)
        helpContainerList.addChild(helpContainerCloseButton)

        helpContainer.addChild(new Graphics().beginFill(0xeeeeee).drawRect(-20, 0, helpContainerList.width + 40, helpContainerList.height + 40))
        helpContainer.x = app.screen.width / 2 - helpContainer.width / 2
        helpContainer.y = app.screen.height / 2 - helpContainer.height / 2

        helpContainer.addChild(helpContainerList)

        return helpContainer
    }
}
