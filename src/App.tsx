import React from "react";
import { Text, Box } from "ink";
import { Task, Tasks } from "./db/DB.js";
import { useTasks } from "./hooks/useTasks.js";
import TextInput from "ink-text-input";
import { OrderTasks } from "./hooks/useTasks.js";
import { usePriority } from "./hooks/usePriority.js";
import { PORT } from "./root.js";

export default function App({ tasks }: { tasks: Tasks }): React.ReactNode {
    const { state, setAddText, setEditText } = useTasks(tasks);

    function getList(): React.ReactNode[] {
        const elements: React.ReactNode[] = [];
        for (let i = 0; i < state.tasks.length; ++i) {
            const task = state.tasks[i];

            if (!state.normal && state.idx === i) {
                elements.push(
                    <Input
                        value={state.editText}
                        onChange={setEditText}
                        task={task}
                        key={i}
                    />,
                );
            } else {
                elements.push(
                    <TaskView
                        task={task}
                        idx={state.idx}
                        loopIndex={i}
                        key={i}
                    />,
                );
            }
        }

        const isFocus: boolean = state.idx === elements.length;

        if (state.normal || (!state.normal && !isFocus)) {
            elements.push(<AddBtn isFocus={isFocus} key={elements.length} />);
        } else if (!state.normal && isFocus) {
            elements.push(
                <Input
                    value={state.addText}
                    onChange={setAddText}
                    key={elements.length}
                />,
            );
        }

        return elements;
    }

    return (
        <>
            <OrderBox order={state.order.type} />
            {getList()}
        </>
    );
}

function OrderBox({ order }: { order: OrderTasks }): React.ReactNode {
    let tc = "none";
    let color = "";
    let sym = "";

    if (order === "PRIORITY_HL") {
        tc = "Priority H-L";
        sym = "";
        color = "red";
    } else if (order === "PRIORITY_LH") {
        tc = "Priority L-H";
        sym = "";
        color = "green";
    } else if (order === "DEC_AO") {
        tc = "Z-A";
        sym = "";
        color = "red";
    } else if (order === "INC_AO") {
        tc = "A-Z";
        sym = "";
        color = "green";
    }

    return (
        <Box width="50%" justifyContent="space-between">
            <Text>
                Order: <Text color={color}>{`${tc} ${sym}`}</Text>
            </Text>
            <Text>{`Server port: ${PORT}`}</Text>
        </Box>
    );
}

function TaskView({
    task,
    idx,
    loopIndex,
}: {
    task: Task;
    idx: number;
    loopIndex: number;
}): React.ReactNode {
    const { priorityColor, priorityDesc } = usePriority(task);

    const borderStyle = (key: number) => {
        if (key === idx) {
            return "bold";
        }
        return "round";
    };
    const borderColor = (key: number) => {
        if (key === idx) {
            return "blue";
        }
        return "";
    };

    return (
        <Box
            borderStyle={borderStyle(loopIndex)}
            borderColor={borderColor(loopIndex)}
            width="50%"
        >
            <PriorityText
                priorityColor={priorityColor}
                priorityDesc={priorityDesc}
            />
            <Text>{task.name}</Text>
        </Box>
    );
}

function AddBtn({ isFocus }: { isFocus: boolean }): React.ReactNode {
    let borderStyle = "round";
    let borderColor = "";
    if (isFocus) {
        borderStyle = "bold";
        borderColor = "blue";
    }

    return (
        <Box
            borderStyle={borderStyle as "round" | "bold"}
            borderColor={borderColor}
            width="50%"
        >
            <Text>Add</Text>
        </Box>
    );
}

interface InputProps {
    value: string;
    onChange: (s: string) => void;
    task?: Task;
}

function Input({ value, onChange, task }: InputProps): React.ReactNode {
    let priorityText = <></>;
    if (task) {
        const { priorityColor, priorityDesc } = usePriority(task);
        priorityText = (
            <PriorityText
                priorityColor={priorityColor}
                priorityDesc={priorityDesc}
            />
        );
    }

    return (
        <Box borderStyle="bold" borderColor="blue" width="50%">
            {priorityText}
            <TextInput value={value} onChange={onChange}></TextInput>
        </Box>
    );
}

function PriorityText({
    priorityDesc,
    priorityColor,
}: {
    priorityDesc: string;
    priorityColor: string;
}): React.ReactNode {
    return (
        <>
            <Text color="black" backgroundColor={priorityColor}>
                {` ${priorityDesc} `}
            </Text>
            <Text>{"  "}</Text>
        </>
    );
}
