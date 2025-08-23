import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import n8nService from '../services/n8nService';
import { N8NWorkflowTemplate } from '../types/n8n';
import { workflowTemplates } from '../data/n8nWorkflowTemplates';

const Container = styled.div`
  padding: 24px;
  margin: 20px 0;
  border-radius: 16px;
  overflow: hidden;
`;

const Title = styled.h3`
  color: #fff;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background: ${({ active }) => active ? '#007acc' : 'transparent'};
  color: ${({ active }) => active ? '#fff' : '#ccc'};
  border: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ active }) => active ? '#005a9e' : '#333'};
  }
`;

const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const WorkflowCard = styled.div`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #444;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #007acc;
    transform: translateY(-2px);
  }
`;

const WorkflowTitle = styled.h4`
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const WorkflowDescription = styled.p`
  color: #ccc;
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const WorkflowMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const MetaTag = styled.span<{ type: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${({ type }) => {
    switch (type) {
      case 'webhook':
        return 'background: rgba(0, 122, 204, 0.2); color: #007acc; border: 1px solid #007acc;';
      case 'schedule':
        return 'background: rgba(255, 193, 7, 0.2); color: #ffc107; border: 1px solid #ffc107;';
      case 'manual':
        return 'background: rgba(108, 117, 125, 0.2); color: #6c757d; border: 1px solid #6c757d;';
      case 'wellness':
        return 'background: rgba(40, 167, 69, 0.2); color: #28a745; border: 1px solid #28a745;';
      case 'analytics':
        return 'background: rgba(220, 53, 69, 0.2); color: #dc3545; border: 1px solid #dc3545;';
      case 'notifications':
        return 'background: rgba(255, 193, 7, 0.2); color: #ffc107; border: 1px solid #ffc107;';
      case 'integrations':
        return 'background: rgba(111, 66, 193, 0.2); color: #6f42c1; border: 1px solid #6f42c1;';
      default:
        return 'background: rgba(108, 117, 125, 0.2); color: #6c757d; border: 1px solid #6c757d;';
    }
  }}
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 8px;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: #007acc;
          color: #fff;
          &:hover { background: #005a9e; }
        `;
      case 'secondary':
        return `
          background: #444;
          color: #fff;
          &:hover { background: #555; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: #fff;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #007acc;
          color: #fff;
          &:hover { background: #005a9e; }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Alert = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return 'background: rgba(40, 167, 69, 0.1); border: 1px solid #28a745; color: #28a745;';
      case 'error':
        return 'background: rgba(220, 53, 69, 0.1); border: 1px solid #dc3545; color: #dc3545;';
      case 'info':
        return 'background: rgba(0, 122, 204, 0.1); border: 1px solid #007acc; color: #007acc;';
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #ccc;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
`;

const N8NWorkflowManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'deployed'>('templates');
  const [templates, setTemplates] = useState<N8NWorkflowTemplate[]>([]);
  const [deployedWorkflows, setDeployedWorkflows] = useState<N8NWorkflowTemplate[]>([]);
    const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // For now, use local templates. In production, this would fetch from N8N API
      const fetchedTemplates = await n8nService.getWorkflowTemplates();
      // Fallback to local templates if API fails
      setTemplates(fetchedTemplates.length > 0 ? fetchedTemplates : workflowTemplates);
    } catch (error) {
      // Use local templates as fallback
      setTemplates(workflowTemplates);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployWorkflow = async (template: N8NWorkflowTemplate) => {
    try {
      const result = await n8nService.createWorkflow(template);
      if (result.success) {
        setAlert({
          type: 'success',
          message: `Workflow "${template.name}" deployed successfully!`
        });
        // Move to deployed workflows
        setDeployedWorkflows(prev => [...prev, template]);
        setTemplates(prev => prev.filter(t => t.id !== template.id));
      } else {
        setAlert({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to deploy workflow'
      });
    }
  };

  const handleRemoveWorkflow = (workflowId: string) => {
    setDeployedWorkflows(prev => prev.filter(w => w.id !== workflowId));
    setAlert({
      type: 'info',
      message: 'Workflow removed from deployed list'
    });
  };

  const renderWorkflowCard = (workflow: N8NWorkflowTemplate, isDeployed: boolean = false) => (
    <WorkflowCard key={workflow.id}>
      <WorkflowTitle>{workflow.name}</WorkflowTitle>
      <WorkflowDescription>{workflow.description}</WorkflowDescription>
      
      <WorkflowMeta>
        <MetaTag type={workflow.trigger}>{workflow.trigger}</MetaTag>
        <MetaTag type={workflow.category}>{workflow.category}</MetaTag>
      </WorkflowMeta>
      
      <div>
        {isDeployed ? (
          <>
            <Button variant="secondary" onClick={() => handleRemoveWorkflow(workflow.id)}>
              Remove
            </Button>
            <Button variant="primary">
              Configure
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={() => handleDeployWorkflow(workflow)}>
              Deploy
            </Button>
            <Button variant="secondary">
              Preview
            </Button>
          </>
        )}
      </div>
    </WorkflowCard>
  );

  if (loading) {
    return (
      <Container className="glass-card">
        <Title>N8N Workflow Manager</Title>
        <LoadingSpinner>Loading workflow templates...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container className="glass-card">
      <Title>N8N Workflow Manager</Title>
      
      {alert && (
        <Alert type={alert.type}>
          {alert.message}
        </Alert>
      )}

      <TabContainer>
        <Tab 
          active={activeTab === 'templates'} 
          onClick={() => setActiveTab('templates')}
        >
          Available Templates ({templates.length})
        </Tab>
        <Tab 
          active={activeTab === 'deployed'} 
          onClick={() => setActiveTab('deployed')}
        >
          Deployed Workflows ({deployedWorkflows.length})
        </Tab>
      </TabContainer>

      {activeTab === 'templates' && (
        <>
          {templates.length === 0 ? (
            <EmptyState>
              <h4>No workflow templates available</h4>
              <p>Check your N8N connection or create custom templates</p>
            </EmptyState>
          ) : (
            <WorkflowGrid>
              {templates.map(template => renderWorkflowCard(template))}
            </WorkflowGrid>
          )}
        </>
      )}

      {activeTab === 'deployed' && (
        <>
          {deployedWorkflows.length === 0 ? (
            <EmptyState>
              <h4>No deployed workflows</h4>
              <p>Deploy workflows from the templates tab to get started</p>
            </EmptyState>
          ) : (
            <WorkflowGrid>
              {deployedWorkflows.map(workflow => renderWorkflowCard(workflow, true))}
            </WorkflowGrid>
          )}
        </>
      )}
    </Container>
  );
};

export default N8NWorkflowManager;