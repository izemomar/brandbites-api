export interface IUseCase<IRequest, IResponse> {
  execute(requestDTO: IRequest): Promise<IResponse>;
}
