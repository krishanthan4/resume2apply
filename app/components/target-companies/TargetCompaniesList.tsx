"use client";

import React from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { TargetCompanyCard } from "./TargetCompanyCard";

interface TargetCompaniesListProps {
  companies: any[];
  onDragEnd: (result: any) => void;
  deleteCompany: (id: string) => void;
  handleLocalChange: (id: string, field: string, value: string) => void;
  flushUpdate: (id: string, updates: any) => void;
  autoFetchConnections: (id: string, companyName: string, linkedinPageUrl?: string) => void;
}

export function TargetCompaniesList({
  companies,
  onDragEnd,
  deleteCompany,
  handleLocalChange,
  flushUpdate,
  autoFetchConnections,
}: TargetCompaniesListProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="targets-list" direction="vertical">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-4"
          >
            {companies.map((company, index) => (
              <TargetCompanyCard
                key={company._id}
                company={company}
                index={index}
                deleteCompany={deleteCompany}
                handleLocalChange={handleLocalChange}
                flushUpdate={flushUpdate}
                autoFetchConnections={autoFetchConnections}
              />
            ))}
            {provided.placeholder}

            {companies.length === 0 && (
              <div className="py-16 text-center text-zinc-500 bg-zinc-50/50 rounded-[14px] border border-dashed border-zinc-200 text-sm">
                Your target list is empty. Add a company to start organising!
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
