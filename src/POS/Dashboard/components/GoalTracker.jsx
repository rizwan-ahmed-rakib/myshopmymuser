// src/POS/Dashboard/components/GoalTracker.jsx
import React, { useState } from 'react';
import { Target, Edit2, Check, X } from 'lucide-react';
import { Card, SectionTitle, Skeleton } from './Shared';
import { fmtCompact, fmtCurrency, setMonthlyGoal } from '../utils/dashboardUtils';

const GoalTracker = ({ loading, goal, onGoalChange }) => {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(goal?.target || 0);

    if (loading) {
        return <Card><Skeleton h={160} /></Card>;
    }
    if (!goal) return null;

    const { achieved, target, pct, remaining, onTrack, pace, expectedPct } = goal;
    const barColor = onTrack ? '#10b981' : (pace > -20 ? '#f59e0b' : '#ef4444');

    const handleSave = () => {
        const v = parseFloat(tempValue);
        if (v > 0) {
            setMonthlyGoal(v);
            onGoalChange?.();
        }
        setEditing(false);
    };

    return (
        <Card>
            <SectionTitle
                icon="🎯"
                action={
                    editing ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                            <button
                                onClick={handleSave}
                                style={{
                                    background: '#10b981', border: 'none',
                                    color: 'white', padding: '3px 8px',
                                    borderRadius: 6, fontSize: 11, fontWeight: 700,
                                    cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', gap: 3,
                                }}
                            >
                                <Check size={10} /> Save
                            </button>
                            <button
                                onClick={() => setEditing(false)}
                                style={{
                                    background: '#f1f5f9', border: 'none',
                                    color: '#64748b', padding: '3px 8px',
                                    borderRadius: 6, fontSize: 11, fontWeight: 700,
                                    cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', gap: 3,
                                }}
                            >
                                <X size={10} /> Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setTempValue(target);
                                setEditing(true);
                            }}
                            style={{
                                background: 'none', border: 'none',
                                color: '#0ea5e9', fontSize: 11, fontWeight: 700,
                                cursor: 'pointer', display: 'flex',
                                alignItems: 'center', gap: 3,
                            }}
                        >
                            <Edit2 size={10} /> Set Goal
                        </button>
                    )
                }
            >
                Monthly Target
            </SectionTitle>

            {editing ? (
                <div style={{ padding: '8px 0' }}>
                    <label style={{
                        fontSize: 10, fontWeight: 700, color: '#64748b',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                        Target Amount (৳)
                    </label>
                    <input
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        autoFocus
                        style={{
                            width: '100%', marginTop: 4,
                            padding: '8px 12px',
                            border: '1px solid #cbd5e1', borderRadius: 8,
                            fontSize: 14, fontWeight: 700,
                            outline: 'none',
                        }}
                    />
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-end', marginBottom: 12,
                    }}>
                        <div>
                            <div style={{
                                fontSize: 20, fontWeight: 800,
                                color: barColor, letterSpacing: '-0.02em',
                            }}>
                                {pct}%
                            </div>
                            <div style={{
                                fontSize: 11, color: '#64748b', marginTop: 2,
                            }}>
                                {fmtCompact(achieved)} of {fmtCompact(target)}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                fontSize: 11, fontWeight: 700,
                                color: onTrack ? '#10b981' : '#f59e0b',
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                                <Target size={11} />
                                {onTrack ? 'On Track' : 'Behind'}
                            </div>
                            <div style={{
                                fontSize: 10.5, color: '#94a3b8', marginTop: 2,
                            }}>
                                Expected: {expectedPct}%
                            </div>
                        </div>
                    </div>

                    {/* Progress bar with expected marker */}
                    <div style={{
                        position: 'relative',
                        height: 10, background: '#f1f5f9',
                        borderRadius: 5, overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%', width: `${pct}%`,
                            background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
                            borderRadius: 5,
                            transition: 'width .8s ease',
                        }} />
                        {/* Expected marker */}
                        <div style={{
                            position: 'absolute', top: -2, left: `${Math.min(100, expectedPct)}%`,
                            width: 2, height: 14,
                            background: '#0f172a',
                            opacity: 0.3,
                        }} />
                    </div>

                    <div style={{
                        marginTop: 10, padding: '8px 10px',
                        background: onTrack ? '#f0fdf4' : '#fffbeb',
                        borderRadius: 8,
                        fontSize: 11.5, color: onTrack ? '#065f46' : '#92400e',
                        fontWeight: 600,
                    }}>
                        {onTrack
                            ? `দুর্দান্ত! ${fmtCurrency(remaining)} বাকি — আপনি এগিয়ে আছেন`
                            : `আরও ${fmtCurrency(remaining)} দরকার এই মাসে`}
                    </div>
                </>
            )}
        </Card>
    );
};

export default GoalTracker;